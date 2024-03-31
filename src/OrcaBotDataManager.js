"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
/**
 * Class Handling Data Management
 */
class OrcaBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        /**
         * The File Path on the Host Device that is storing the Mounted Data
         */
        this.HOST_DEVICE_MOUNT_LOCATION = "";
        /**
         * The Host Name of the Host Device Supporting the Container
         */
        this.HOSTNAME = "";
        /**
         * A Mapping between the Discord User who sent the Command and the Server User
         */
        this.DISCORD_USER_TO_SERVER_USER = {};
        /**
         * A Mapping between the Discord User who sent the Command and the Download Location on their Personal Device
         */
        this.DISCORD_USER_TO_DOWNLOAD_LOCATION = {};
        /**
         * The Maximum File size for a Zip File to be sent through Discord (in MB)
         */
        this.ZIP_FILE_MAX_SIZE_MB = 5;
        /**
         * The Maximum File size for a regular File to be sent through Discord (in MB)
         */
        this.FILE_MAX_SIZE_MB = 5;
        /**
         * Stores the Job Name and a mapping to the Full Job Archive
         */
        this.JOB_ARCHIVE_MAP = {};
        this.JOB_FOLDER = "/OrcaJobs";
        this.JOB_ARCHIVE_FOLDER = "/OrcaJobsArchive";
    }
    /**
     * Sets the Mounted Directory File Path (Used for creating the SCP Copy Command)
     * @param filepath The Path on the Host Device to the Mounted Directory
     */
    SetMountLocation(filepath) {
        this.HOST_DEVICE_MOUNT_LOCATION = filepath;
        this.SaveData();
    }
    /**
     * Sets the Host Name / Device Name of the Server
     * @param hostName The Host Name of the Server
     */
    SetHostName(hostName) {
        this.HOSTNAME = hostName;
        this.SaveData();
    }
    /**
     * Adds a Mapping of the Discord User to the Server User
     * @param discordUser The Discord User who called the Command
     * @param serverUser The Server User of the Discord User
     */
    AddServerUser(discordUser, serverUser) {
        this.DISCORD_USER_TO_SERVER_USER[discordUser] = serverUser;
        this.SaveData();
    }
    /**
     * Adds a Mapping of the Discord User to a Personalized Download Location
     * @param discordUser The Discord User who called the Command
     * @param downloadLocation The Download Location on the Discord Users Device
     */
    AddDownloadLocation(discordUser, downloadLocation) {
        this.DISCORD_USER_TO_DOWNLOAD_LOCATION[discordUser] = downloadLocation;
        this.SaveData();
    }
    /**
     * Adds a Job and it's Full Archive File Name
     * @param jobName The Name of the Job to Archive
     * @param jobArchiveFile The File of the Job Archive
     */
    AddJobArchive(jobName, jobArchiveFilePath) {
        this.JOB_ARCHIVE_MAP[jobName] = jobArchiveFilePath;
        this.SaveData();
    }
}
exports.default = OrcaBotDataManager;
