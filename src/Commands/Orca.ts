import { OptionTypesEnum, BotDataManager, Command, DefaultCommandHandler, BotData } from "dna-discord-framework"
import { ActivityType, CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import fsp from "fs/promises"
import OrcaBotDataManager from "../OrcaBotDataManager";
import OrcaJob from "../OrcaJob";
import OrcaJobFile from "../OrcaJobFile";

/**
 * Command that Runs an Orca Calculation on the Device the Bot is hosted by
 */
class Orca extends Command {

    /* <inheritdoc> */
    CommandName = "orca";

    /* <inheritdoc> */
    CommandDescription = "Runs an Orca Calculation on the Server";

    /* <inheritdoc> */
    IsEphemeralResponse = false;

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

    /* <inheritdoc> */
    JobIsComplete = false;

    /* <inheritdoc> */
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const inputfile = interaction.options.getAttachment("inputfile");
        const xyzfile1 = interaction.options.getAttachment("xyzfile1");
        const xyzfile2 = interaction.options.getAttachment("xyzfile2");
        const xyzfile3 = interaction.options.getAttachment("xyzfile3");
        const xyzfile4 = interaction.options.getAttachment("xyzfile4");
        const xyzfile5 = interaction.options.getAttachment("xyzfile5");

        this.DiscordUser = interaction.user.username;

        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!inputfile) {
            this.InitializeUserResponse(interaction, "No Data Manager found, cannot run Command.")
            return;
        }

        this.InitializeUserResponse(interaction, `Running Orca Calculation on ${inputfile.name}`);

        let orcaJob = new OrcaJob(inputfile.name);

        try {
            await orcaJob.CreateDirectories();
            await orcaJob.DownloadFile(inputfile);
            await orcaJob.DownloadFile(xyzfile1);
            await orcaJob.DownloadFile(xyzfile2);
            await orcaJob.DownloadFile(xyzfile3);
            await orcaJob.DownloadFile(xyzfile4);
            await orcaJob.DownloadFile(xyzfile5);

            this.AddToResponseMessage(`Server will provide updates for the output file every 10 seconds`);
            this.UpdateFile(orcaJob);

            dataManager.AddJob(orcaJob);

            if (client.user)
                client.user.setActivity(`Orca Calculation ${orcaJob.JobName}`, { type: ActivityType.Playing });

            await orcaJob.RunJob();

            this.JobIsComplete = true;

            this.AddToResponseMessage(`Server has completed the Orca Calculation (${this.GetJobTime(orcaJob)}):white_check_mark:`);

            await this.SendFile(OrcaJobFile.OutputFile, orcaJob);
            await this.SendFile(OrcaJobFile.XYZFile, orcaJob);
            await this.SendFile(OrcaJobFile.TrajectoryXYZFile, orcaJob);
            await this.SendFullJobArchive(orcaJob);

            await dataManager.RemoveJob(orcaJob);

            this.QueueNextActivity(client, dataManager);

            this.PingUser(interaction, orcaJob.JobName, true);
        } catch (e) {
            try {
                if (orcaJob) {
                    this.AddToResponseMessage("An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.");
                    this.JobIsComplete = true;
                    dataManager.RemoveJob(orcaJob);
                    this.PingUser(interaction, orcaJob.JobName, false);
                }
                if (e instanceof Error)
                    dataManager.AddErrorLog(e);

                this.QueueNextActivity(client, dataManager);
            } catch (j) {
                if (j instanceof Error)
                    dataManager.AddErrorLog(j);
            }
        }
    };

    /**
     * Gets the Elapsed Time since the Job Started in String format
     * @param orcaJob The Orca Job Instance
     * @returns The Elapsed Time since the Job Started in String format
     */
    private GetJobTime(orcaJob: OrcaJob) {
        const now = Date.now();
        const elapsed = new Date(now - orcaJob.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();

        if (hours > 0)
            return `${hours} h:${minutes} m`;
        else
            return `${minutes} m`;
    }

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

    /**
     * Sends a Message and Pings the User who Called the Calculation, provides a Link to the Calculation
     * @param interaction The Message Interaction Created by the User
     */
    private PingUser(interaction: ChatInputCommandInteraction<CacheType>, jobName: string, success: boolean) {
        const link = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${this.UserResponse?.id}`;

        if (success)
            interaction.user.send(`${interaction.user} Server has completed the Orca Calculation ${jobName} :white_check_mark: \n It can be found here : ${link}`);
        else
            interaction.user.send(`${interaction.user} Server has encoutered a problem with the Orca Calculation ${jobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${link}`);
    }

    /**
     * Updates the 
     * @param orcaJob The Job that is currently running
     */
    async UpdateFile(orcaJob: OrcaJob) {
        while (!this.JobIsComplete) {
            await new Promise(resolve => setTimeout(resolve, 10000));

            try {
                const filePath = orcaJob.GetFullFilePath(OrcaJobFile.OutputFile);
                const fileStats = await fsp.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);

                if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordUser)}`);
                else
                    this.AddFileToResponseMessage(filePath);

            } catch (e) { console.log(e); }
        }
    }

    /**
      * The Username of the User who called the Command
      */
    DiscordUser: string = "";

    /**
     * Adds the Specified file to the Bot Response for the User to Download. If the File is too Large it sends the SCP Command needed to Download
     * @param file The Name of the Job File
     * @param orcaJob The Orca Job Instance
     */
    async SendFile(file: OrcaJobFile, orcaJob: OrcaJob) {
        try {
            await orcaJob.CopyToArchive(file);

            const filePath = orcaJob.GetFullFilePath(file);
            const fileStats = await fsp.stat(filePath);
            const sizeAndFormat = orcaJob.GetFileSize(fileStats);

            if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(file, this.DiscordUser)}`);
            else
                this.AddFileToResponseMessage(filePath);

        } catch (e) { console.log(e); }
    }

    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     * @param orcaJob The Orca Job Instance
     */
    async SendFullJobArchive(orcaJob: OrcaJob) {
        try {
            await orcaJob.ArchiveJob();

            const filePath = orcaJob.GetFullFilePath(OrcaJobFile.ArchiveFile);
            const fileStats = await fsp.stat(filePath);
            const sizeAndFormat = orcaJob.GetFileSize(fileStats);

            if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).ZIP_FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.ArchiveFile, this.DiscordUser)}`);
            else
                this.AddFileToResponseMessage(filePath);

        } catch (e) { console.log(e); }
    }
}

export = Orca;