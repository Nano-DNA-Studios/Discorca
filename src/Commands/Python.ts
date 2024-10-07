import { ActivityType, CacheType, ChatInputCommandInteraction, Client, TextChannel, User } from "discord.js";
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
        const pythonpackage = interaction.options.getAttachment("pythonpackage");
        const channel = await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel;

        this.CalculationMessage = new BotMessage(channel);
        this.DiscordCommandUser = interaction.user;

        if (!dataManager.IsDiscorcaSetup())
            return this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");

        if (!pythonpackage)
            return this.AddToMessage("No Python Package was Provided. Please Provide a Python Package to Run");

        let pythonJob = new PythonJob(pythonpackage.name, this.DiscordCommandUser.username);

        this.AddToMessage(`Starting Python Job Setup: ${pythonpackage.name} :snake:`);

        await pythonJob.Setup([pythonpackage])

        this.AddToMessage(`Files Received`);

        if (!pythonJob.PythonPackageExists())
            return this.AddToMessage(`File provided is not a valid Python Package. Please provide a valid Python Package to Run`);

        this.AddToMessage(`Discorca will start the Python Calculation :hourglass_flowing_sand:`);

        this.CalculationMessage.AddMessage(`Running Python Calculation ${pythonJob.JobName} - ${pythonJob.JobAuthor} :snake:`);

        if (!(await pythonJob.SetupPythonEnvironment(this.CalculationMessage)))
            return await this.SendResults(pythonJob, dataManager, this.DiscordCommandUser);

        if (client.user)
            client.user.setActivity(`Python Calculation ${pythonJob.JobName}`, { type: ActivityType.Playing });

        dataManager.AddJobArchive(pythonJob);
        dataManager.AddJob(pythonJob);

        this.CalculationMessage.AddMessage(`Running Start.py :hourglass_flowing_sand:`);

        await pythonJob.RunJob();

        if (!pythonJob.JobSuccess)
            this.CalculationMessage.AddMessage(`Python Calculation Failed :warning:`);
        else
            this.CalculationMessage.AddMessage(`Python Calculation Completed Successfully (${pythonJob.JobElapsedTime()}) :white_check_mark:`);

        await this.SendResults(pythonJob, dataManager, this.DiscordCommandUser);

        dataManager.RemoveJob(pythonJob);
        dataManager.QueueNextActivity(client);
    };

    public async SendResults (pythonJob: PythonJob, dataManager: BotDataManager, user : User)
    {
        await pythonJob.ArchiveJob(dataManager);
        await pythonJob.SendPythonLogs(this.CalculationMessage);
        await pythonJob.PingUser(this.CalculationMessage, user);
    }

    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "pythonpackage",
            description: "The Python Job Package to run",
            required: true,
        }
    ];
}

export = Python;