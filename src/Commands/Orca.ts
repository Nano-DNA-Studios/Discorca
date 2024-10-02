import { OptionTypesEnum, BotDataManager, Command, DefaultCommandHandler, BotData, BotMessage, BotCommunication, DefaultBotCommunication } from "dna-discord-framework"
import { ActivityType, CacheType, ChatInputCommandInteraction, Client, TextChannel, User } from "discord.js";
import OrcaBotDataManager from "../OrcaBotDataManager";
import OrcaJob from "../OrcaJob/OrcaJob";
import { resolve } from "path";

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
        const inputfile = interaction.options.getAttachment("inputfile");
        const xyzfile1 = interaction.options.getAttachment("xyzfile1");
        const xyzfile2 = interaction.options.getAttachment("xyzfile2");
        const xyzfile3 = interaction.options.getAttachment("xyzfile3");
        const xyzfile4 = interaction.options.getAttachment("xyzfile4");
        const xyzfile5 = interaction.options.getAttachment("xyzfile5");

        this.DiscordCommandUser = interaction.user;
        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!inputfile) {
            this.AddToMessage("Input file was not provided");
            return;
        }

        this.AddToMessage(`Preparing Orca Calculation on ${inputfile.name}`);

        let files = [inputfile, xyzfile1, xyzfile2, xyzfile3, xyzfile4, xyzfile5];
        let orcaJob = new OrcaJob(inputfile.name, this.DiscordCommandUser?.username);
        this.CalculationMessage = new BotMessage(await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel);

        try {
            await orcaJob.Setup(files);

            this.AddToMessage(`Files Received`);
            this.CalculationMessage.AddMessage(`Running Orca Calculation on ${inputfile.name} :atom:`);

            dataManager.AddJobArchive(orcaJob);
            dataManager.AddJob(orcaJob);

            if (client.user)
                client.user.setActivity(`Orca Calculation ${orcaJob.JobName}`, { type: ActivityType.Playing });

            this.AddToMessage(`Discorca will start the Orca Calculation :hourglass_flowing_sand: :atom:`);

            orcaJob.UpdateOutputFile(this.CalculationMessage);

            await orcaJob.RunJob();

            await orcaJob.SendAllFiles(this.CalculationMessage, dataManager);
            await orcaJob.PingUser(this.CalculationMessage, this.DiscordCommandUser);

            if (orcaJob.JobSuccess)
                this.CalculationMessage.AddMessage(`Server has completed the Orca Calculation (${orcaJob.JobElapsedTime()}) :white_check_mark:`);
            else
                this.CalculationMessage.AddMessage(`Server has completed the Orca Calculation with Errors (${orcaJob.JobElapsedTime()}) :warning:`);
            
            await dataManager.RemoveJob(orcaJob);

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

    /**
     * Updates the Status of the Bot to the Next Job in the Queue
     * @param client Discord Bot Client Instance
     * @param dataManager The OrcaBotDataManager Instance
     */
    private QueueNextActivity(client: Client<boolean>, dataManager: OrcaBotDataManager): void {
        if (client.user) {
            if (Object.keys(dataManager.RUNNING_JOBS).length == 0)
                client.user.setActivity(" ", { type: ActivityType.Custom, state: "Listening for New Orca Calculation" });
            else {
                let job = Object.values(dataManager.RUNNING_JOBS)[0];
                client.user.setActivity(`Orca Calculation ${job.JobName}`, { type: ActivityType.Playing, });
            }
        }
    }
}

export = Orca;