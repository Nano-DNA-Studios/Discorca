import { BotDataManager, SyncInfo, Job } from "dna-discord-framework";
import OrcaJob from "./OrcaJob/OrcaJob";
import { ActivityType, Client } from "discord.js";
import fs from "fs";
import PythonJob from "./PythonJob/PythonJob";

/**
 * Class Handling Data Management
 */
class OrcaBotDataManager extends BotDataManager {

    /**
     * The Setup Status of the Server
     */
    public DISCORCA_SETUP: boolean = false;

    /**
     * The Port to the Server is Port Forwarded on
     */
    public PORT: number = 0;

    /**
     * The File Path on the Host Device that is storing the Mounted Data
     */
    public HOST_DEVICE_MOUNT_LOCATION: string = "";

    /**
     * The Host Name of the Host Device Supporting the Container
     */
    public HOSTNAME: string = "";

    /**
     * The Maximum File size for a Zip File to be sent through Discord (in MB)
     */
    public ZIP_FILE_MAX_SIZE_MB: number = 5;

    /**
     * The Maximum File size for a regular File to be sent through Discord (in MB) 
     */
    public FILE_MAX_SIZE_MB: number = 5;

    /**
     * A Mapping between the Discord User who sent the Command and the Server User
     */
    public DISCORD_USER_SCP_INFO: Record<string, SyncInfo> = {};

    /**
     * A Mapping between the Discord User who sent the Command and the Download Location on their Personal Device
     */
    public DISCORD_USER_TO_DOWNLOAD_LOCATION: Record<string, string> = {};

    /**
     * Stores the Job Name and a mapping to the Job Instance
     */
    public JOB_ARCHIVE_MAP: Record<string, Job> = {};

    /**
     * The Path to the Folder for Orca Jobs that are running
     */
    public JOB_FOLDER: string = "/DiscorcaJobs/Orca/Job";

    /**
     * The Path to the Folder for Python Jobs that are running
     */
    public PYTHON_JOB_FOLDER: string = "/DiscorcaJobs/Python/Job";

    /**
     * The Path to the Orca Jobs Archive
     */
    public JOB_ARCHIVE_FOLDER: string = "/DiscorcaJobs/Orca/Archive";

    /**
     * The Path to the Python Jobs Archive
     */
    public PYTHON_JOB_ARCHIVE_FOLDER: string = "/DiscorcaJobs/Python/Archive";

    /**
     * A Dictionary of Running Jobs on the Server
     */
    public RUNNING_JOBS: Record<string, Job> = {};

    /**
     * The Channel ID for the Text Channel Calculation Results are sent to
     */
    public CALCULATION_CHANNEL_ID: string = "";

    /**
     * Sets the Calculation Channel ID
     */
    public SetCalculationChannelID(channelID: string) {
        this.CALCULATION_CHANNEL_ID = channelID;
    }

    /**
     * Returns a Boolean based on if there are Jobs Running
     * @returns True if there are Jobs Running
     */
    public IsJobRunning(): boolean {
        return Object.keys(this.RUNNING_JOBS).length > 0;
    }

    /**
     * Retrieves the Archive Direcotry Path on the Host Device
     * @returns 
     */
    public GetHostDeviceArchivePath(): string {
        return this.HOST_DEVICE_MOUNT_LOCATION + "/Orca/Archive";
    }

    /**
     * Purges the Jobs Folder by deleting it and recreating it
     */
    public PurgeJobs(): void {
        if (fs.existsSync(this.JOB_FOLDER))
            fs.rmSync(this.JOB_FOLDER, { recursive: true });

        this.CreateJobDirectories();
    }

    /**
     * Purges the Archive Folder by deleting it and recreating it
     */
    public PurgeArchive(): void {
        if (fs.existsSync(this.JOB_ARCHIVE_FOLDER))
            fs.rmSync(this.JOB_ARCHIVE_FOLDER, { recursive: true });

        this.JOB_ARCHIVE_MAP = {};

        this.CreateJobDirectories();
        this.SaveData();
    }

    /**
     * Creates the Job Directories if they don't Exist
     */
    public CreateJobDirectories(): void {
        if (!fs.existsSync(this.JOB_FOLDER))
            fs.mkdirSync(this.JOB_FOLDER, { recursive: true });

        if (!fs.existsSync(this.JOB_ARCHIVE_FOLDER))
            fs.mkdirSync(this.JOB_ARCHIVE_FOLDER, { recursive: true });

        if (!fs.existsSync(this.PYTHON_JOB_FOLDER))
            fs.mkdirSync(this.PYTHON_JOB_FOLDER, { recursive: true });

        if (!fs.existsSync(this.PYTHON_JOB_ARCHIVE_FOLDER))
            fs.mkdirSync(this.PYTHON_JOB_ARCHIVE_FOLDER, { recursive: true });
    }

    /**
     * Checks if the Server has been Setup
     * @returns True if the Server has been Setup
     */
    public IsDiscorcaSetup(): boolean {
        return this.HOSTNAME != "" && this.HOST_DEVICE_MOUNT_LOCATION != "" && this.CALCULATION_CHANNEL_ID != "";
    }

    /**
     * Sets the Mounted Directory File Path (Used for creating the SCP Copy Command)
     * @param filepath The Path on the Host Device to the Mounted Directory
     */
    public SetMountLocation(filepath: string) {
        this.HOST_DEVICE_MOUNT_LOCATION = filepath;
    }

    /**
     * Sets the Host Name / Device Name of the Server
     * @param hostName The Host Name of the Server
     */
    public SetHostName(hostName: string) {
        this.HOSTNAME = hostName;
    }


    /**
     * Adds a Mapping of the Discord User to the Server User and the Download Location
     * @param discordUser The Discord User who called the Command
     * @param serverUser The Server User of the Discord User
     * @param downloadLocation The Download Location on the Discord Users Device
     */
    public AddSCPUser(discordUser: string, serverUser: string, downloadLocation: string) {
        let syncInfo: SyncInfo = new SyncInfo(this.HOSTNAME, this.PORT, serverUser, "", downloadLocation);
        this.DISCORD_USER_SCP_INFO[discordUser] = syncInfo;
        this.SaveData();
    }

    /**
     * Adds a Mapping of the Discord User to a Personalized Download Location 
     * @param discordUser The Discord User who called the Command 
     * @param downloadLocation The Download Location on the Discord Users Device
     */
    public AddDownloadLocation(discordUser: string, downloadLocation: string) {
        this.DISCORD_USER_TO_DOWNLOAD_LOCATION[discordUser] = downloadLocation;
        this.SaveData();
    }

    /**
     * Sets the Port Number of the Server
     * @param port The Port Number
     */
    public SetPort(port: number) {
        this.PORT = port;
    }

    /**
     * Sets the Maximum Size Zip Files can be before returning a SCP Copy Command
     * @param maxsize The new Max Size of Zip Files
     */
    public SetMaxZipSize(maxsize: number) {
        this.ZIP_FILE_MAX_SIZE_MB = maxsize;
        this.FILE_MAX_SIZE_MB = maxsize;
    }

    /**
     * Adds a Job and it's Full Archive File Name
     * @param jobName The Name of the Job to Archive
     * @param job The Job to Archive
     */
    public AddJobArchive(job: Job) {
        this.JOB_ARCHIVE_MAP[job.JobName] = job;
        this.SaveData();
    }

    /**
     * Adds a Job Instance to the Running Jobs
     * @param job The Job to Add to the Running Jobs
     */
    public AddJob(job: Job) {
        this.RUNNING_JOBS[job.JobName] = job;
        this.SaveData();
    }

    /**
     * Removes a Job Instance from the Running Jobs
     * @param job The Job to Remove from the Running Jobs
     */
    public RemoveJob(job: Job) {
        delete this.RUNNING_JOBS[job.JobName];
        this.SaveData();
    }

    /**
     * Clears all Stored Running Jobs
     */
    public ClearJobs() {
        this.RUNNING_JOBS = {};
        this.SaveData();
    }

    /**
     * Sets the Starting Activity of the Bot to Listening for New Orca Calculations
     * @param client The Client to Set the Activity for
     */
    public SetActivityToListen(client: Client<boolean>) {
        if (client.user)
            client.user.setActivity(" ", { type: ActivityType.Custom, state: "Listening for New Orca Calculation" });
    }

    public GetSCPInfo(discordUser: string): SyncInfo {
        if (Object.keys(this.DISCORD_USER_SCP_INFO).includes(discordUser))
            return this.DISCORD_USER_SCP_INFO[discordUser];
        else
            return new SyncInfo("", 0, "", "", "");
    }

    /**
     * Updates the Status of the Bot to the Next Job in the Queue
     * @param client Discord Bot Client Instance
     */
    public QueueNextActivity(client: Client<boolean>): void {
        if (client.user) {
            if (Object.keys(this.RUNNING_JOBS).length == 0)
                client.user.setActivity(" ", { type: ActivityType.Custom, state: "Listening for New Orca Calculation" });
            else {
                let job = Object.values(this.RUNNING_JOBS)[0];

                if (job instanceof OrcaJob)
                    client.user.setActivity(`Orca Calculation ${job.JobName}`, { type: ActivityType.Playing, });
                else if (job instanceof PythonJob)
                    client.user.setActivity(`Python Calculation ${job.JobName}`, { type: ActivityType.Playing, });
            }
        }
    }
}

export default OrcaBotDataManager;