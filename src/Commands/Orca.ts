import { OptionTypesEnum, BotDataManager, Command, DefaultCommandHandler, BotData, BotMessage, BotCommunication, DefaultBotCommunication } from "dna-discord-framework"
import { ActivityType, CacheType, ChatInputCommandInteraction, Client, GuildMember, TextChannel, User } from "discord.js";
import OrcaBotDataManager from "../OrcaBotDataManager";
import OrcaJob from "../OrcaJob/OrcaJob";

/**
 * Command that Runs an Orca Calculation on the Device the Bot is hosted by
 */
class Orca extends Command {

    /* <inheritdoc> */
    CommandName = "orca";

    /* <inheritdoc> */
    CommandDescription = "Runs an Orca Calculation on the Server";

    /* <inheritdoc> */
    IsEphemeralResponse = true;

    /* <inheritdoc> */
    CommandHandler = DefaultCommandHandler.Instance();

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "inputfile",
            description: "Orca File to Run through Orca",
            required: true,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile1",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile2",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile3",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile4",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile5",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
    ];

    /**
     * The Name of the Job that is currently running
     */
    JobName: string = "";

    /**
     * The Message that will be sent to the Calculation Channel
     */
    CalculationMessage: BotCommunication = new DefaultBotCommunication();

    /**
     * User instance that called the Command
     */
    DiscordCommandUser: User | undefined;

    /* <inheritdoc> */
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const inputfile = interaction.options.getAttachment("inputfile");
        const xyzfile1 = interaction.options.getAttachment("xyzfile1");
        const xyzfile2 = interaction.options.getAttachment("xyzfile2");
        const xyzfile3 = interaction.options.getAttachment("xyzfile3");
        const xyzfile4 = interaction.options.getAttachment("xyzfile4");
        const xyzfile5 = interaction.options.getAttachment("xyzfile5");

        this.CalculationMessage = new BotMessage(await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel);
        this.DiscordCommandUser = interaction.user;
        let author: string | null = this.DiscordCommandUser.displayName

        if (interaction.member && interaction.member instanceof GuildMember) {
            author = interaction.member.nickname;
        }

        if (!dataManager.IsDiscorcaSetup())
            return this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");

        if (!inputfile)
            return this.AddToMessage("Input file was not provided");

        this.AddToMessage(`Preparing Orca Calculation on ${inputfile.name} :atom:`);

        let files = [inputfile, xyzfile1, xyzfile2, xyzfile3, xyzfile4, xyzfile5];
        let orcaJob = new OrcaJob(inputfile.name, this.DiscordCommandUser?.username);

        try {
            await orcaJob.Setup(files);

            this.AddToMessage(`Files Received`);
            this.CalculationMessage.AddMessage(`Running Orca Calculation on ${inputfile.name} - ${orcaJob.JobAuthor} (${author}) :atom:`);

            dataManager.AddJobArchive(orcaJob);
            dataManager.AddJob(orcaJob);

            if (client.user)
                client.user.setActivity(`Orca Calculation ${orcaJob.JobName}`, { type: ActivityType.Playing });

            this.AddToMessage(`Discorca will start the Orca Calculation :hourglass_flowing_sand:`);

            orcaJob.UpdateOutputFile(this.CalculationMessage);

            await orcaJob.RunJob();

            if (!orcaJob.JobSuccess)
                this.CalculationMessage.AddMessage(`Server has encountered Errors while running the Orca Calculation (${orcaJob.JobElapsedTime()}) :warning:`);
            else
                this.CalculationMessage.AddMessage(`Server has completed the Orca Calculation (${orcaJob.JobElapsedTime()}) :white_check_mark:`);

            await orcaJob.SendAllFiles(this.CalculationMessage, dataManager);
            await orcaJob.PingUser(this.CalculationMessage, this.DiscordCommandUser);

            dataManager.RemoveJob(orcaJob);
            dataManager.QueueNextActivity(client);
        } catch (e) {
            try {
                if (orcaJob) {
                    this.CalculationMessage.AddMessage("An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.");
                    dataManager.RemoveJob(orcaJob);
                    orcaJob.PingUser(this.CalculationMessage, this.DiscordCommandUser);
                }
                if (e instanceof Error)
                    dataManager.AddErrorLog(e);

                dataManager.QueueNextActivity(client);
            } catch (j) {
                if (j instanceof Error)
                    dataManager.AddErrorLog(j);
            }
        }
    };
}

export = Orca;