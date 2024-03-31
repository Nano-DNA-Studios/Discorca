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

    /* <inheritdoc> */
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const data = interaction.options.getAttachment("orcafile");

        if (!data)
            return;

        this.DiscordUser = interaction.user.username;

        this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);

        let orcaJob: OrcaJob = new OrcaJob(data.name);

        await orcaJob.CreateDirectories();
        await orcaJob.DownloadFile(data.url);
        await orcaJob.RunJob();

        this.AddToResponseMessage(":white_check_mark: Server has completed the Orca Calculation :white_check_mark:");

        await this.SendFile(OrcaJobFile.OutputFile, orcaJob);
        await this.SendFile(OrcaJobFile.XYZFile, orcaJob);
        await this.SendFile(OrcaJobFile.TrajectoryXYZFile, orcaJob);
        await this.SendFullJobArchive(orcaJob);
    };

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