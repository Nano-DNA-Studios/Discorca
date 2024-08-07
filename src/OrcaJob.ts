import { BashScriptRunner, BotData } from "dna-discord-framework"
import OrcaBotDataManager from "./OrcaBotDataManager";
import fs from "fs";
import axios from "axios";
import OrcaJobFile from "./OrcaJobFile";
import IOrcaJob from "./IOrcaJob";
import { Attachment } from "discord.js";

class OrcaJob implements IOrcaJob {

    /**
    * The Name of the File sent (Without the file extension)
    */
    JobName: string;

    /**
     * The Archive File That is Generated from the Orca Calculation
     */
    ArchiveFile: string;

    /**
     * The Path/Directory to the Job Folder containing all Jobs
     */
    JobDirectory: string;

    /**
    * The path to the Specific Job Folder. A new Folder is created for the Job so that all files are isolated
    */
    OrcaJobDirectory: string;

    /**
     * The Directory that Stores all Archive Folders
     */
    JobArchiveDirectory: string;

    /**
     * The Folder storing all the Archived Jobs that have already Ran. When the Calculation is complete a copy of the Job is created and sent to the Archive
     */
    OrcaJobArchiveDirectory: string;

    /**
     * The Name of the Input File (With Extension)
     */
    InputFileName: string;

    /**
     * The Name of the Output File (With Extension)
     */
    OutputFileName: string;

    /**
     * The Name of the XYZ File (With Extension)
     */
    XYZFileName: string;

    /**
     * The Name of the Trajectory XYZ File (With Extension)
     */
    TrjXYZFileName: string;

    /**
     * The Directory on the Host Device where the Archive Mount is Stored
     */
    HostArchiveDirectory: string;

    /**
     * The Start Time of the Job
     */
    StartTime: number;

    /**
     * Sets the Job Name 
     * @param jobName The Name of the Job / Orca Input File Supplied (Without File Extension)
     */
    constructor(jobName: string) {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        this.JobName = jobName.split(".")[0];
        this.InputFileName = `${this.JobName}.inp`;
        this.OutputFileName = `${this.JobName}.out`;
        this.XYZFileName = `${this.JobName}.xyz`;
        this.TrjXYZFileName = `${this.JobName}_trj.xyz`;
        this.ArchiveFile = `${this.JobName}Full.tar.gz`;
        this.JobDirectory = dataManager.JOB_FOLDER;
        this.JobArchiveDirectory = dataManager.JOB_ARCHIVE_FOLDER;
        this.OrcaJobDirectory = `${this.JobDirectory}/${this.JobName}`;
        this.OrcaJobArchiveDirectory = `${this.JobArchiveDirectory}/${this.JobName}`;
        this.HostArchiveDirectory = dataManager.HOST_DEVICE_MOUNT_LOCATION;
        this.StartTime = Date.now();
    }

    /**
    * Purges Similar Named Directories and Creates them for the Job
    */
    CreateDirectories() {
        try { fs.rmSync(this.OrcaJobDirectory, { recursive: true, force: true }); } catch (e) { }
        try { fs.mkdirSync(this.OrcaJobDirectory, { recursive: true }); } catch (e) { }

        try { fs.rmSync(this.OrcaJobArchiveDirectory, { recursive: true, force: true }); } catch (e) { }
        try { fs.mkdirSync(this.OrcaJobArchiveDirectory); } catch (e) { }
    }

    /**
    * Creates the SCP Copy Command for the User to Copy and use in their Terminal
    * @param fileName The Name of the File to Copy
    * @returns The SCP Copy Command to Download the File
    */
    GetCopyCommand(file: OrcaJobFile, discordUser: string): string {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        try {
            const user = dataManager.DISCORD_USER_TO_SERVER_USER[discordUser];
            const downloadLocation = dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION[discordUser];
            const hostName = dataManager.HOSTNAME;

            let command = "";
            if (dataManager.PORT == 0)
                command = `scp ${user}@${hostName}:${this.GetFullMountFilePath(file)} ${downloadLocation}`;
            else
                command = `scp -P ${dataManager.PORT} ${user}@${hostName}:${this.GetFullMountFilePath(file)} ${downloadLocation}`;

            return "```" + command + "```"
        } catch (e) {
            const command = `scp serverUser@hostName:${this.GetFullMountFilePath(file)} /Path/on/local/device`;
            return "```" + command + "```"
        }
    }

    /**
     * Gets the File Size and Unit 
     * @param fileStats The File Stats of the File to Check
     * @returns Returns a Tuple with the File Size associated with the File Size Unit
     */
    GetFileSize(fileStats: fs.Stats): [Number, string] {
        let realsize;
        let sizeFormat;

        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        } else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        } else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }

        return [realsize, sizeFormat];
    }
   
    /**
    * Simple function to download a file from a URL
    * @param attachement The Attachment to Download
    */
    public async DownloadFile(attachement: Attachment | null) {

        if (!attachement)
            return

        try {
            const response = await axios({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });

            let writer = fs.createWriteStream(`${this.OrcaJobDirectory}/${attachement.name}`);

            await response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }

    /**
     * Runs the Orca Calculation Job
     */
    public async RunJob(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        await new BashScriptRunner().RunLocally(`/Orca/orca  ${this.GetFullFilePath(OrcaJobFile.InputFile)} > ${this.GetFullFilePath(OrcaJobFile.OutputFile)}`, this.OrcaJobDirectory).catch(e => {
            e.name += `: Run Job (${this.JobName})`;
            dataManager.AddErrorLog(e);});
    }

    /**
     * Creates the Compressed Archive File
     */
    public async ArchiveJob() {
        let runner = new BashScriptRunner();
        const dataManager = BotData.Instance(OrcaBotDataManager);
        await runner.RunLocally(`tar -zcvf  ${this.GetFullFilePath(OrcaJobFile.ArchiveFile)} -C ${this.JobDirectory} ${this.JobName}`).catch(e => {
            e.name += `: Archive Job (${this.JobName})`;
            dataManager.AddErrorLog(e);});
    }

    /**
     * Gets the Full Path to the Specified File
     * @param fileName The Name of the Job File
     * @returns The Full Path to the Orca Job File
     */
    public GetFullFilePath(fileName: OrcaJobFile): string {
        switch (fileName) {
            case OrcaJobFile.InputFile:
                return `${this.OrcaJobDirectory}/${this.InputFileName}`;
            case OrcaJobFile.OutputFile:
                return `${this.OrcaJobDirectory}/${this.OutputFileName}`;
            case OrcaJobFile.XYZFile:
                return `${this.OrcaJobDirectory}/${this.XYZFileName}`;
            case OrcaJobFile.TrajectoryXYZFile:
                return `${this.OrcaJobDirectory}/${this.TrjXYZFileName}`;
            case OrcaJobFile.ArchiveFile:
                return `${this.OrcaJobArchiveDirectory}/${this.ArchiveFile}`;
            default:
                return "";
        }
    }

    /**
     * Gets the Full Path to the File Relative to the Host Devices Mounted Location for all Archives
     * @param fileName The Name of the Job File
     * @returns The Full Path to the Mounted File Path
     */
    public GetFullMountFilePath(fileName: OrcaJobFile): string {
        switch (fileName) {
            case OrcaJobFile.InputFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.InputFileName}`;
            case OrcaJobFile.OutputFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.OutputFileName}`;
            case OrcaJobFile.XYZFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.XYZFileName}`;
            case OrcaJobFile.TrajectoryXYZFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.TrjXYZFileName}`;
            case OrcaJobFile.ArchiveFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.ArchiveFile}`;
            default:
                return "";
        }
    }

    /**
     * Gets the Full Name (With extension) of the Job File
     * @param fileName The Name of the Job File
     * @returns The Full Name of the Orca Job File
     */
    public GetFileName(fileName: OrcaJobFile) {
        switch (fileName) {
            case OrcaJobFile.InputFile:
                return this.InputFileName;
            case OrcaJobFile.OutputFile:
                return this.OutputFileName;
            case OrcaJobFile.XYZFile:
                return this.XYZFileName;
            case OrcaJobFile.TrajectoryXYZFile:
                return this.TrjXYZFileName;
            case OrcaJobFile.ArchiveFile:
                return this.ArchiveFile;
            default:
                return "";
        }
    }

    /**
     * Copies the Job File to the Archive Folder
     * @param file The Name of the Job File
     */
    public CopyToArchive(file: OrcaJobFile) {
        fs.readdirSync(this.OrcaJobDirectory).forEach(file => {
            fs.copyFileSync(file, `${this.OrcaJobArchiveDirectory}/${file}`, fs.constants.COPYFILE_EXCL);
        });
    }

}

export default OrcaJob;