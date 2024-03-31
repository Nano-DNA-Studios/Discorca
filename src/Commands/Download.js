"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const OrcaJob_1 = __importDefault(require("../OrcaJob"));
const OrcaJobFile_1 = __importDefault(require("../OrcaJobFile"));
/**
 * Command that Purges all Job Folders in the Job Directory
 */
class ListJobArchive extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "download";
        /* <inheritdoc> */
        this.CommandDescription = "Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download.";
        /**
        * The Username of the User who called the Command
        */
        this.DiscordUser = "";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.DiscordUser = interaction.user.username;
            const archiveName = interaction.options.getString("archivename");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            if (!archiveName) {
                this.InitializeUserResponse(interaction, "The Archive Name has not been Supplied, cannot Download a File without an Archive Name");
                return;
            }
            const orcaJob = new OrcaJob_1.default(archiveName);
            if (fs_1.default.readdirSync(dataManager.JOB_ARCHIVE_FOLDER).includes(archiveName)) {
                this.InitializeUserResponse(interaction, "File is found in Archive, Preparing...");
                const filePath = orcaJob.GetFullFilePath(OrcaJobFile_1.default.ArchiveFile);
                const fileStats = yield promises_1.default.stat(filePath);
                const size = orcaJob.GetFileSize(fileStats);
                //this.GetCopyCommand(dataManager.JOB_ARCHIVE_MAP[archiveName])
                if (size[0] > dataManager.ZIP_FILE_MAX_SIZE_MB && size[1] == "MB") {
                    this.AddToResponseMessage(`The Archive File is too Large (${size[0]} MB), it can be Downloaded using the Following Command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.ArchiveFile, this.DiscordUser)}`);
                }
                else {
                    this.AddFileToResponseMessage(filePath);
                }
            }
            else {
                this.InitializeUserResponse(interaction, `The Archive Name ${archiveName} is not Valid. Use /listarchive to list all Downloadable Archives.`);
            }
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.Options = [
            {
                name: "archivename",
                description: "The Name of the Archive to Download",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
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
}
module.exports = ListJobArchive;
