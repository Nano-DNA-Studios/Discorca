import { BotDataManager, ICommandOptionChoice } from "dna-discord-framework";

/**
 * Class Handling Data Management
 */
class OrcaBotDataManager extends BotDataManager {

    /**
     * The File Path on the Host Device that is storing the Mounted Data
     */
    public HOST_DEVICE_MOUNT_LOCATION: string = "";

    /**
     * The Host Name of the Host Device Supporting the Container
     */
    public HOSTNAME: string = "";

    /**
     * A Mapping between the Discord User who sent the Command and the Server User
     */
    public DISCORD_USER_TO_SERVER_USER: Record<string, string> = {};

    /**
     * A Mapping between the Discord User who sent the Command and the Download Location on their Personal Device
     */
    public DISCORD_USER_TO_DOWNLOAD_LOCATION: Record<string, string> = {};

    /**
     * The Maximum File size for a Zip File to be sent through Discord (in MB)
     */
    public ZIP_FILE_MAX_SIZE_MB: number = 5;

    /**
     * The Maximum File size for a regular File to be sent through Discord (in MB) 
     */
    public FILE_MAX_SIZE_MB: number = 5;

    /**
     * Stores the Job Name and a mapping to the Full Job Archive
     */
    public JOB_ARCHIVE_MAP: Record<string, string> = {};

    public JOB_FOLDER: string = "/OrcaJobs";

    public JOB_ARCHIVE_FOLDER:string = "/OrcaJobsArchive";

    /**
     * Sets the Mounted Directory File Path (Used for creating the SCP Copy Command)
     * @param filepath The Path on the Host Device to the Mounted Directory
     */
    public SetMountLocation(filepath: string) {
        this.HOST_DEVICE_MOUNT_LOCATION = filepath;
        this.SaveData();
    }

    /**
     * Sets the Host Name / Device Name of the Server
     * @param hostName The Host Name of the Server
     */
    public SetHostName(hostName: string) {
        this.HOSTNAME = hostName;
        this.SaveData();
    }

    /**
     * Adds a Mapping of the Discord User to the Server User
     * @param discordUser The Discord User who called the Command 
     * @param serverUser The Server User of the Discord User
     */
    public AddServerUser(discordUser: string, serverUser: string) {
        this.DISCORD_USER_TO_SERVER_USER[discordUser] = serverUser;
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
     * Adds a Job and it's Full Archive File Name
     * @param jobName The Name of the Job to Archive
     * @param jobArchiveFile The File of the Job Archive
     */
    public AddJobArchive(jobName: string, jobArchiveFilePath: string) {
        this.JOB_ARCHIVE_MAP[jobName] = jobArchiveFilePath;
        this.SaveData();
    }
}

export default OrcaBotDataManager;