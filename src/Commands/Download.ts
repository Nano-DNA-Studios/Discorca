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
    DiscordUser: string = "";

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

    // /**
    // * Creates the SCP Copy Command for the User to Copy and use in their Terminal
    // * @param fileName The Name of the File to Copy
    // * @returns The SCP Copy Command to Download the File
    // */
    // GetCopyCommand(archiveLocation: string): string {
    //     const dataManager = BotData.Instance(OrcaBotDataManager);
    //     const mountLocation = dataManager.HOST_DEVICE_MOUNT_LOCATION;
    //     const user = dataManager.DISCORD_USER_TO_SERVER_USER[this.DiscordUser];
    //     const downloadLocation = dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION[this.DiscordUser];
    //     const hostName = dataManager.HOSTNAME;
    //     const command = `scp ${user}@${hostName}:${archiveLocation} ${downloadLocation}`;

    //     return "```" + command + "```"
    // }

    // /**
    // * Gets the File Size and Unit 
    // * @param fileStats The File Stats of the File to Check
    // * @returns Returns a Tuple with the File Size associated with the File Size Unit
    // */
    // GetFileSize(fileStats: fs.Stats): [number, string] {
    //     let realsize;
    //     let sizeFormat;

    //     if (fileStats.size / (1024 * 1024) >= 1) {
    //         realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
    //         sizeFormat = "MB";
    //     } else if (fileStats.size / (1024) >= 1) {
    //         realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
    //         sizeFormat = "KB";
    //     } else {
    //         realsize = fileStats.size;
    //         sizeFormat = "B";
    //     }

    //     return [realsize, sizeFormat];
    // }
}

export = ListJobArchive;