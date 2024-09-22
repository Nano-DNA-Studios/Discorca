import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";
import OrcaJob from "../OrcaJob";
import OrcaJobFile from "../OrcaJobFile";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Download extends Command {
    /* <inheritdoc> */
    public CommandName = "download";

    /* <inheritdoc> */
    public CommandDescription = "Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download.";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /**
    * The Username of the User who called the Command
    */
    public DiscordUser: string = "";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const archiveName = interaction.options.getString("archivename");
        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!archiveName) {
            this.AddToMessage("The Archive Name has not been Supplied, cannot Download a File without an Archive Name");
            return;
        }

        if (!Object.keys(dataManager.JOB_ARCHIVE_MAP).includes(archiveName)) {
            this.AddToMessage(`The Archive Name ${archiveName} is not Valid. Use /listarchive to list all Downloadable Archives.`);
            return;
        }

        const orcaJob: OrcaJob = dataManager.JOB_ARCHIVE_MAP[archiveName] as OrcaJob
        const filePath = orcaJob.GetFullFilePath(OrcaJobFile.ArchiveFile)

        if (!fs.existsSync(filePath)) {
            this.AddToMessage(`The Archive File for ${archiveName} doesn't Exist. Please let the Calclaution Finish and Try Again.`);
            return;
        }

        this.AddToMessage("File is found in Archive, Uploading...");
        const size = orcaJob.GetFileSize(filePath);

        if (size[0] > dataManager.ZIP_FILE_MAX_SIZE_MB && size[1] == "MB")
            this.AddToMessage(`The Archive File is too Large (${size[0]} MB), it can be Downloaded using the Following Command ${orcaJob.GetCopyCommand(OrcaJobFile.ArchiveFile)}`);
        else
            this.AddFileToMessage(filePath);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    public Options?: ICommandOption[] = [
        {
            name: "archivename",
            description: "The Name of the Archive to Download",
            required: true,
            type: OptionTypesEnum.String
        }
    ];
}

export = Download;