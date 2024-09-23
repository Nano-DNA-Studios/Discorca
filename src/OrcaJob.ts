import { BashScriptRunner, BotCommunication, BotData, BotDataManager } from "dna-discord-framework"
import OrcaBotDataManager from "./OrcaBotDataManager";
import OrcaJobFile from "./OrcaJobFile";
import { User } from "discord.js";
import fs from "fs";
import Job from "./Jobs/Job";
import OrcaJobManager from "./OrcaJobManager";
import SCPInfo from "./SCPInfo";

//class OrcaJob implements IOrcaJob {
class OrcaJob extends Job {

    /* <inheritdoc> */
    JobGlobalDirectory: string = "/DiscorcaJobs";

    /* <inheritdoc> */
    JobCategory: string = "Orca";

    /* <inheritdoc> */
    JobManager: OrcaJobManager = new OrcaJobManager();

    /**
     * The Archive File That is Generated from the Orca Calculation
     */
    ArchiveFile: string;

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
     * Sets the Job Name 
     * @param jobName The Name of the Job / Orca Input File Supplied (Without File Extension)
     */
    constructor(jobName: string, commandUser: string) {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        super(jobName.split(".")[0], commandUser);
        this.InputFileName = `${this.JobName}.inp`;
        this.OutputFileName = `${this.JobName}.out`;
        this.XYZFileName = `${this.JobName}.xyz`;
        this.TrjXYZFileName = `${this.JobName}_trj.xyz`;
        this.ArchiveFile = `${this.JobName}Full.tar.gz`;
    }

    /**
    * Creates the SCP Copy Command for the User to Copy and use in their Terminal
    * @param file The Name of the File to Copy
    * @returns The SCP Copy Command to Download the File
    */
    GetFileCopyCommand(file: OrcaJobFile): string {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const filePath = `${this.JobManager.HostJobDirectory}/${this.JobName}/${this.GetFileName(file)}`;
        const scpInfo: SCPInfo = dataManager.GetSCPInfo(this.JobAuthor);
        return this.JobManager.GetSCPCommand(scpInfo, filePath);
       // return scpInfo.GetSCPCommand(filePath);
    }


    /**
     * Runs the Orca Calculation Job
     */
    public async RunJob(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        await new BashScriptRunner().RunLocally(`/Orca/orca  ${this.GetFullFilePath(OrcaJobFile.InputFile)} > ${this.GetFullFilePath(OrcaJobFile.OutputFile)}`, true, this.JobDirectory).catch(e => {
            console.log(e);
            e.name += `: Run Job (${this.JobName})`;
            dataManager.AddErrorLog(e);
            this.JobSuccess = false;
        });

        this.JobFinished = true;
    }

    /**
     * Creates the Compressed Archive File
     */
    public async ArchiveJob(dataManager: BotDataManager) {
        let runner = new BashScriptRunner();
        await runner.RunLocally(`tar -zcvf  ${this.GetFullFilePath(OrcaJobFile.ArchiveFile)} -C  ${this.JobManager.JobLibraryDirectory} ${this.JobName}`).catch(e => {
            e.name += `: Archive Job (${this.JobName})`;
            dataManager.AddErrorLog(e);
        });
    }

    /**
     * Gets the Full Path to the Specified File
     * @param fileName The Name of the Job File
     * @returns The Full Path to the Orca Job File
     */
    public GetFullFilePath(fileName: OrcaJobFile): string {
        switch (fileName) {
            case OrcaJobFile.InputFile:
                return `${this.JobDirectory}/${this.InputFileName}`;
            case OrcaJobFile.OutputFile:
                return `${this.JobDirectory}/${this.OutputFileName}`;
            case OrcaJobFile.XYZFile:
                return `${this.JobDirectory}/${this.XYZFileName}`;
            case OrcaJobFile.TrajectoryXYZFile:
                return `${this.JobDirectory}/${this.TrjXYZFileName}`;
            case OrcaJobFile.ArchiveFile:
                return `${this.ArchiveDirectory}/${this.ArchiveFile}`;
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
     * Pings the User that the Job has been Completed
     * @param message The Message related to the Job
     * @param jobsUser The User to send the Ping to
     * @param success Whether the Job was Successful or not
     */
    public async PingUser(message: BotCommunication, jobsUser: User): Promise<void> {
        if (this.JobSuccess)
            await jobsUser.send(`${jobsUser} Server has completed the Orca Calculation ${this.JobName} :white_check_mark: \n It can be found here : ${message.GetLink()}`);
        else
            await jobsUser.send(`${jobsUser} Server has encoutered a problem with the Orca Calculation ${this.JobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${message.GetLink()}`);
    }

    /**
     * Sends all quickly accessible Files to the User
     * @param message 
     */
    public async SendAllFiles(message: BotCommunication, dataManager: BotDataManager): Promise<void> {
        await this.ArchiveJob(dataManager);

        this.SendFile(message, OrcaJobFile.OutputFile);
        this.SendFile(message, OrcaJobFile.XYZFile);
        this.SendFile(message, OrcaJobFile.TrajectoryXYZFile);
        this.SendFile(message, OrcaJobFile.ArchiveFile);
    }

    /**
     * Sends an individual File to the Message for the Job
     * @param message 
     * @param file 
     */
    public async SendFile(message: BotCommunication, file: OrcaJobFile): Promise<void> {
        const filePath = this.GetFullFilePath(file);

        if (!fs.existsSync(filePath))
            return

        const sizeAndFormat = this.GetFileSize(filePath);

        if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
            if (!message.content?.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetFileCopyCommand(file)}`))
                message.AddMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetFileCopyCommand(file)}`);
        }
        else
            message.AddFile(filePath);
    }

    /**
     * Starts a loop that Sends the latest version of the Output file and uploads it to Discord. 
     * @param message The Bot Communication Message the file will be uploaded to
     */
    public async UpdateOutputFile(message: BotCommunication): Promise<void> {
        let count = 0;
        while (!this.JobFinished) {
            await new Promise(resolve => {
                setTimeout(() => {
                    count += 1;
                    resolve(undefined); // Call the resolve function to resolve the promise
                }, 100);
            });

            if (count > 100) {
                count = 0;
                this.SendFile(message, OrcaJobFile.OutputFile);
            }
        }

        this.SendFile(message, OrcaJobFile.OutputFile);
    }

    public JobResourceUsage(): Record<string, number> {
        let record = { "Cores": this.GetNumberOfCores() };

        return record;
    }

    /**
     * Extracts the Number of Cores that will be used from the Input File
     * @param job The OrcaJob to Analyze
     * @returns The Number of Cores that will be used
     */
    private GetNumberOfCores(): number {
        const file = fs.readFileSync(this.GetFullFilePath(OrcaJobFile.InputFile), 'utf8');
        const regexPattern = /PAL(\d+)/;
        const match = file.match(regexPattern);

        if (match)
            return parseInt(match[1]);
        else
            return 1;
    }
}

export default OrcaJob;