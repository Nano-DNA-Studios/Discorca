"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaJobDescription_1 = __importDefault(require("./OrcaJobDescription"));
const discord_js_1 = require("discord.js");
const fs_1 = __importDefault(require("fs"));
/**
 * Class Handling Data Management
 */
class OrcaBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        /**
         * The Setup Status of the Server
         */
        this.DISCORCA_SETUP = false;
        /**
         * The Port to the Server is Port Forwarded on
         */
        this.PORT = 0;
        /**
         * The File Path on the Host Device that is storing the Mounted Data
         */
        this.HOST_DEVICE_MOUNT_LOCATION = "";
        /**
         * The Host Name of the Host Device Supporting the Container
         */
        this.HOSTNAME = "";
        /**
         * The Maximum File size for a Zip File to be sent through Discord (in MB)
         */
        this.ZIP_FILE_MAX_SIZE_MB = 5;
        /**
         * The Maximum File size for a regular File to be sent through Discord (in MB)
         */
        this.FILE_MAX_SIZE_MB = 5;
        /**
         * A Mapping between the Discord User who sent the Command and the Server User
         */
        this.DISCORD_USER_TO_SERVER_USER = {};
        /**
         * A Mapping between the Discord User who sent the Command and the Download Location on their Personal Device
         */
        this.DISCORD_USER_TO_DOWNLOAD_LOCATION = {};
        /**
         * Stores the Job Name and a mapping to the Full Job Archive
         */
        this.JOB_ARCHIVE_MAP = {};
        /**
         * The Path to the Folder for Orca Jobs that are running
         */
        this.JOB_FOLDER = "/DiscorcaJobs/Orca/Job";
        /**
         * The Path to the Folder for Python Jobs that are running
         */
        this.PYTHON_JOB_FOLDER = "/DiscorcaJobs/Python/Job";
        /**
         * The Path to the Orca Jobs Archive
         */
        this.JOB_ARCHIVE_FOLDER = "/DiscorcaJobs/Orca/Archive";
        /**
         * The Path to the Python Jobs Archive
         */
        this.PYTHON_JOB_ARCHIVE_FOLDER = "/DiscorcaJobs/Python/Archive";
        /**
         * A Dictionary of Running Jobs on the Server
         */
        this.RUNNING_JOBS = {};
        /**
         * The Channel ID for the Text Channel Calculation Results are sent to
         */
        this.CALCULATION_CHANNEL_ID = "";
    }
    /**
     * Sets the Calculation Channel ID
     */
    SetCalculationChannelID(channelID) {
        this.CALCULATION_CHANNEL_ID = channelID;
    }
    /**
     * Returns a Boolean based on if there are Jobs Running
     * @returns True if there are Jobs Running
     */
    IsJobRunning() {
        return Object.keys(this.RUNNING_JOBS).length > 0;
    }
    /**
     * Retrieves the Archive Direcotry Path on the Host Device
     * @returns
     */
    GetHostDeviceArchivePath() {
        return this.HOST_DEVICE_MOUNT_LOCATION + "/Orca/Archive";
    }
    /**
     * Purges the Jobs Folder by deleting it and recreating it
     */
    PurgeJobs() {
        if (fs_1.default.existsSync(this.JOB_FOLDER))
            fs_1.default.rmSync(this.JOB_FOLDER, { recursive: true });
        this.CreateJobDirectories();
    }
    /**
     * Purges the Archive Folder by deleting it and recreating it
     */
    PurgeArchive() {
        if (fs_1.default.existsSync(this.JOB_ARCHIVE_FOLDER))
            fs_1.default.rmSync(this.JOB_ARCHIVE_FOLDER, { recursive: true });
        this.CreateJobDirectories();
    }
    /**
     * Creates the Job Directories if they don't Exist
     */
    CreateJobDirectories() {
        if (!fs_1.default.existsSync(this.JOB_FOLDER))
            fs_1.default.mkdirSync(this.JOB_FOLDER, { recursive: true });
        if (!fs_1.default.existsSync(this.JOB_ARCHIVE_FOLDER))
            fs_1.default.mkdirSync(this.JOB_ARCHIVE_FOLDER, { recursive: true });
        if (!fs_1.default.existsSync(this.PYTHON_JOB_FOLDER))
            fs_1.default.mkdirSync(this.PYTHON_JOB_FOLDER, { recursive: true });
        if (!fs_1.default.existsSync(this.PYTHON_JOB_ARCHIVE_FOLDER))
            fs_1.default.mkdirSync(this.PYTHON_JOB_ARCHIVE_FOLDER, { recursive: true });
    }
    /**
     * Checks if the Server has been Setup
     * @returns True if the Server has been Setup
     */
    IsDiscorcaSetup() {
        return this.HOSTNAME != "" && this.HOST_DEVICE_MOUNT_LOCATION != "" && this.CALCULATION_CHANNEL_ID != "";
    }
    /**
     * Sets the Mounted Directory File Path (Used for creating the SCP Copy Command)
     * @param filepath The Path on the Host Device to the Mounted Directory
     */
    SetMountLocation(filepath) {
        this.HOST_DEVICE_MOUNT_LOCATION = filepath;
    }
    /**
     * Sets the Host Name / Device Name of the Server
     * @param hostName The Host Name of the Server
     */
    SetHostName(hostName) {
        this.HOSTNAME = hostName;
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
     * Sets the Port Number of the Server
     * @param port The Port Number
     */
    SetPort(port) {
        this.PORT = port;
    }
    /**
     * Sets the Maximum Size Zip Files can be before returning a SCP Copy Command
     * @param maxsize The new Max Size of Zip Files
     */
    SetMaxZipSize(maxsize) {
        this.ZIP_FILE_MAX_SIZE_MB = maxsize;
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
    /**
     * Adds a Job Instance to the Running Jobs
     * @param job The Job to Add to the Running Jobs
     */
    AddJob(job) {
        this.RUNNING_JOBS[job.JobName] = new OrcaJobDescription_1.default(job);
        this.SaveData();
    }
    /**
     * Removes a Job Instance from the Running Jobs
     * @param job The Job to Remove from the Running Jobs
     */
    RemoveJob(job) {
        delete this.RUNNING_JOBS[job.JobName];
        this.SaveData();
    }
    /**
     * Clears all Stored Running Jobs
     */
    ClearJobs() {
        this.RUNNING_JOBS = {};
        this.SaveData();
    }
    /**
     * Sets the Starting Activity of the Bot to Listening for New Orca Calculations
     * @param client The Client to Set the Activity for
     */
    SetActivityToListen(client) {
        if (client.user)
            client.user.setActivity(" ", { type: discord_js_1.ActivityType.Custom, state: "Listening for New Orca Calculation" });
    }
}
exports.default = OrcaBotDataManager;
