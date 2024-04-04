import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";
import fsp from "fs/promises";
import OrcaJob from "../OrcaJob";
import OrcaJobFile from "../OrcaJobFile";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class ListJobArchive extends Command {
    /* <inheritdoc> */
    public CommandName = "download";

    /* <inheritdoc> */
    public CommandDescription = "Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download.";

    /**
    * The Username of the User who called the Command
    */
    public DiscordUser: string = "";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        this.DiscordUser = interaction.user.username;
        const archiveName = interaction.options.getString("archivename");
        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!archiveName) {
            this.InitializeUserResponse(interaction, "The Archive Name has not been Supplied, cannot Download a File without an Archive Name")
            return;
        }

        const orcaJob: OrcaJob = new OrcaJob(archiveName);
        
        if (fs.readdirSync(dataManager.JOB_ARCHIVE_FOLDER).includes(archiveName)) {
            this.InitializeUserResponse(interaction, "File is found in Archive, Preparing...");
            const filePath = orcaJob.GetFullFilePath(OrcaJobFile.ArchiveFile);
            const fileStats = await fsp.stat(filePath);
            const size = orcaJob.GetFileSize(fileStats);

            //this.GetCopyCommand(dataManager.JOB_ARCHIVE_MAP[archiveName])
            if (size[0] > dataManager.ZIP_FILE_MAX_SIZE_MB && size[1] == "MB") {
                this.AddToResponseMessage(`The Archive File is too Large (${size[0]} MB), it can be Downloaded using the Following Command ${orcaJob.GetCopyCommand(OrcaJobFile.ArchiveFile, this.DiscordUser)}`);
            } else {
                this.AddFileToResponseMessage(filePath);
            }
        } else {
            this.InitializeUserResponse(interaction, `The Archive Name ${archiveName} is not Valid. Use /listarchive to list all Downloadable Archives.`)
        }
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

export = ListJobArchive;