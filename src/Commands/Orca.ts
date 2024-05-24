import { OptionTypesEnum, BotDataManager, Command, DefaultCommandHandler, BotData } from "dna-discord-framework"
import { CacheType, ChatInputCommandInteraction, Client } from "discord.js";
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
    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "orcafile",
            description: "Orca File to Run through Orca",
            required: true,
        },
    ];

    JobName: string = "";

    /* <inheritdoc> */
    JobIsComplete = false;

    /* <inheritdoc> */
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
       
        const data = interaction.options.getAttachment("orcafile");
        this.DiscordUser = interaction.user.username;

        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!data) {
            this.InitializeUserResponse(interaction, "No Data Manager found, cannot run Command.")
            return;
        }

        this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);

        let orcaJob = new OrcaJob(data.name);

        try {
            await orcaJob.CreateDirectories();
            await orcaJob.DownloadFile(data.url);

            this.AddToResponseMessage(`Server will provide updates for the output file every 10 seconds`);
            this.UpdateFile(orcaJob);

            dataManager.AddJob(orcaJob);

            await orcaJob.RunJob();

            this.JobIsComplete = true;

            this.AddToResponseMessage(`Server has completed the Orca Calculation :white_check_mark:`);

            await this.SendFile(OrcaJobFile.OutputFile, orcaJob);
            await this.SendFile(OrcaJobFile.XYZFile, orcaJob);
            await this.SendFile(OrcaJobFile.TrajectoryXYZFile, orcaJob);
            await this.SendFullJobArchive(orcaJob);

            dataManager.RemoveJob(orcaJob);

            this.PingUser(interaction, orcaJob.JobName, true);
        } catch (e) {
            if (orcaJob) {
                this.AddToResponseMessage("An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.");
                this.JobIsComplete = true;
                dataManager.RemoveJob(orcaJob);
                this.PingUser(interaction, orcaJob.JobName, false);
            }
            if (e instanceof Error)
                BotDataManager.AddErrorLog(e);
        }
    };

    /**
     * Sends a Message and Pings the User who Called the Calculation, provides a Link to the Calculation
     * @param interaction The Message Interaction Created by the User
     */
    PingUser(interaction: ChatInputCommandInteraction<CacheType>, jobName: string, success: boolean) {
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