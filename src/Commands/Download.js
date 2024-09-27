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
const OrcaJobManager_1 = __importDefault(require("../OrcaJobManager"));
const Job_1 = __importDefault(require("../Jobs/Job"));
const SizeFormat_1 = __importDefault(require("../Jobs/SizeFormat"));
/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Download extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "download";
        /* <inheritdoc> */
        this.CommandDescription = "Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download.";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /**
        * The Username of the User who called the Command
        */
        this.DiscordUser = "";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const archiveName = interaction.options.getString("archivename");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            this.DiscordUser = interaction.user.username;
            if (!dataManager.IsDiscorcaSetup()) {
                this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                return;
            }
            if (!archiveName) {
                this.AddToMessage("The Archive Name has not been Supplied, cannot Download a File without an Archive Name");
                return;
            }
            try {
                if (!Object.keys(dataManager.JOB_ARCHIVE_MAP).includes(archiveName)) {
                    this.AddToMessage(`The Archive Name ${archiveName} is not Valid. Use /listarchive to list all Downloadable Archives.`);
                    return;
                }
                const syncInfo = dataManager.GetSCPInfo(this.DiscordUser);
                const orcaJobManager = new OrcaJobManager_1.default();
                const orcaJob = dataManager.JOB_ARCHIVE_MAP[archiveName];
                const filePath = this.GetArchiveFilePath(orcaJob);
                if (!fs_1.default.existsSync(filePath)) {
                    this.AddToMessage(`The Archive File for ${archiveName} doesn't Exist. Please let the Calculation Finish and Try Again.`);
                    return;
                }
                this.AddToMessage("File is found in Archive, Uploading...");
                const size = this.GetFileSize(filePath);
                if (this.IsFileLarger(filePath, dataManager.FILE_MAX_SIZE_MB, SizeFormat_1.default.MB))
                    this.AddToMessage(`The Archive File is too Large (${size[0]} MB), it can be Downloaded using the Following Command ${orcaJobManager.GetHostArchiveCopyCommand(syncInfo, orcaJob.JobName, syncInfo.DownloadLocation)}`);
                else
                    this.AddFileToMessage(filePath);
            }
            catch (error) {
                console.error(`Error in Download Command: ${error}`);
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
    }
    GetArchiveFilePath(orcaJob) {
        return `${orcaJob.JobManager.JobGlobalDirectory}/${orcaJob.JobManager.JobCategory}/${Job_1.default.ArchiveSubdirectory}/${orcaJob.JobName}/${orcaJob.ArchiveFile}`;
    }
    GetFileSize(filePath) {
        if (!fs_1.default.existsSync(filePath))
            return [0, "B"];
        const fileStats = fs_1.default.statSync(filePath);
        let realsize;
        let sizeFormat;
        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        }
        else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        }
        else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }
        return [realsize, sizeFormat];
    }
    IsFileLarger(filePath, maxSize, sizeFormat) {
        if (!fs_1.default.existsSync(filePath))
            return false;
        let size = fs_1.default.statSync(filePath).size;
        if (size > maxSize * sizeFormat)
            return true;
        else
            return false;
    }
}
module.exports = Download;
