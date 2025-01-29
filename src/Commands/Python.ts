import { ActivityType, CacheType, ChatInputCommandInteraction, Client, GuildMember, TextChannel, User } from "discord.js";
import { Command, BotDataManager, BotData, OptionTypesEnum, BotMessage, BotCommunication, DefaultBotCommunication } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import PythonJob from "../PythonJob/PythonJob";

class Python extends Command {
    /* <inheritdoc> */
    public CommandName = "python";

    /* <inheritdoc> */
    public CommandDescription = "Runs a Python Calculation on the Server";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /**
     * The Message that will be sent to the Calculation Channel
     */
    CalculationMessage: BotCommunication = new DefaultBotCommunication();

    /**
     * User instance that called the Command
     */
    DiscordCommandUser: User | undefined;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const channel = await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel;
        const pythonFile = interaction.options.getAttachment("pythonfile");
        const installFile = interaction.options.getAttachment("installfile");
        const extraFile1 = interaction.options.getAttachment("extrafile1");
        const extraFile2 = interaction.options.getAttachment("extrafile2");
        const extraFile3 = interaction.options.getAttachment("extrafile3");

        this.CalculationMessage = new BotMessage(channel);
        this.DiscordCommandUser = interaction.user;

        if (!dataManager.IsDiscorcaSetup())
            return this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");

        if (!pythonFile)
            return this.AddToMessage("No Python File or Package was Provided. Please Provide a Python Package or File to Run");

        let pythonJob = new PythonJob(pythonFile.name, this.DiscordCommandUser.displayName);

        this.AddToMessage(`Starting Python Job Setup: ${pythonFile.name} :snake:`);

        await pythonJob.Setup([pythonFile, installFile, extraFile1, extraFile2, extraFile3]);

        this.AddToMessage(`Files Received`);

        if (!pythonJob.IsValidPythonJob())
            return this.AddToMessage(`File provided is not a valid Python Package or File. Please provide a valid Python Package to Run`);

        this.AddToMessage(`Discorca will start the Python Calculation :hourglass_flowing_sand:`);

        this.CalculationMessage.AddMessage(`Running Python Calculation ${pythonJob.JobName} - ${pythonJob.JobAuthor} (${this.GetInteractionAuthor(interaction)}) :snake:`);

        if (!(await pythonJob.SetupPythonEnvironment(this.CalculationMessage)))
            return await this.SendResults(pythonJob, dataManager, this.DiscordCommandUser);

        if (client.user)
            client.user.setActivity(`Python Calculation ${pythonJob.JobName}`, { type: ActivityType.Playing });

        dataManager.AddJobArchive(pythonJob);
        dataManager.AddJob(pythonJob);

        this.CalculationMessage.AddMessage(`Running Start.py :hourglass_flowing_sand:`);

        await pythonJob.RunJob();

        if (!pythonJob.JobSuccess) {
            this.CalculationMessage.AddMessage(`Python Calculation Failed :warning:`);
            this.CalculationMessage.AddFile(`${pythonJob.JobDirectory}/${pythonJob.PythonDetailedLogs}`);
        }
        else
            this.CalculationMessage.AddMessage(`Python Calculation Completed Successfully (${pythonJob.JobElapsedTime()}) :white_check_mark:`);

        await this.SendResults(pythonJob, dataManager, this.DiscordCommandUser);

        dataManager.RemoveJob(pythonJob);
        dataManager.QueueNextActivity(client);
    };

    public GetInteractionAuthor(interaction: ChatInputCommandInteraction<CacheType>): string {
        let author : string = interaction.user.displayName;

        if (interaction.member && interaction.member instanceof GuildMember && interaction.member.nickname)
            author = interaction.member.nickname;

        return author;
    }

    public async SendResults(pythonJob: PythonJob, dataManager: BotDataManager, user: User) {
        await pythonJob.ArchiveJob(dataManager);
        await pythonJob.SendPythonLogs(this.CalculationMessage);
        await pythonJob.PingUser(this.CalculationMessage, user);
    }

    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "pythonfile",
            description: "The Python Package or File containing essential files and the code to run",
            required: true,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "installfile",
            description: "File Listing off all the Python Packages that need to be Installed",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "extrafile1",
            description: "Additional File that can be added to the Python Package",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "extrafile2",
            description: "Additional File that can be added to the Python Package",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "extrafile3",
            description: "Additional File that can be added to the Python Package",
            required: false,
        },
        
    ];
}

export = Python;