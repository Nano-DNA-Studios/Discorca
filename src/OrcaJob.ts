import { BashScriptRunner, BotCommunication, BotData, BotDataManager, SSHManager, SizeFormat, SyncInfo, Job } from "dna-discord-framework"
import OrcaBotDataManager from "./OrcaBotDataManager";
import OrcaJobFile from "./OrcaJobFile";
import fs from "fs";
import OrcaJobManager from "./OrcaJobManager";

class OrcaJob extends Job {

    /* <inheritdoc> */
    JobGlobalDirectory: string = "/DiscorcaJobs";

    /* <inheritdoc> */
    JobManager: OrcaJobManager = new OrcaJobManager();

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
        super(jobName.split(".")[0], commandUser);
        this.InputFileName = `${this.JobName}.inp`;
        this.OutputFileName = `${this.JobName}.out`;
        this.XYZFileName = `${this.JobName}.xyz`;
        this.TrjXYZFileName = `${this.JobName}_trj.xyz`;
    }

    /**
    * Creates the SCP Copy Command for the User to Copy and use in their Terminal
    * @param file The Name of the File to Copy
    * @returns The SCP Copy Command to Download the File
    */
    GetFileCopyCommand(file: OrcaJobFile): string {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const filePath = `${this.JobManager.HostJobDirectory}/${this.JobName}/${this.GetFileName(file)}`;
        const syncInfo: SyncInfo = dataManager.GetSCPInfo(this.JobAuthor);
        return SSHManager.GetSCPCommand(syncInfo, filePath, syncInfo.DownloadLocation);
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

    public GetFileFriendlyName(fileName: OrcaJobFile) {
        switch (fileName) {
            case OrcaJobFile.InputFile:
                return "Input File";
            case OrcaJobFile.OutputFile:
                return "Output File";
            case OrcaJobFile.XYZFile:
                return "XYZ File";
            case OrcaJobFile.TrajectoryXYZFile:
                return "Trajectory XYZ File";
            case OrcaJobFile.ArchiveFile:
                return "Archive File";
            default:
                return "";
        }
    }

    /**
     * Sends all quickly accessible Files to the User
     * @param message 
     */
    public async SendAllFiles(message: BotCommunication, dataManager: BotDataManager): Promise<void> {
        await this.ArchiveJob(dataManager);

        this.SendOrcaFile(message, OrcaJobFile.OutputFile);
        this.SendOrcaFile(message, OrcaJobFile.XYZFile);
        this.SendOrcaFile(message, OrcaJobFile.TrajectoryXYZFile);
        this.SendOrcaFile(message, OrcaJobFile.ArchiveFile);
    }

    /**
     * Sends a Specific Orca File to the Job Message
     * @param message 
     * @param file 
     */
    public async SendOrcaFile(message: BotCommunication, file: OrcaJobFile): Promise<void> {

        let outputFileMessage = `The ${this.GetFileFriendlyName(file)} is too large, download it using the following command ${this.GetFileCopyCommand(file)}`;
        let maxFileSizeMB = BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB;

        this.SendFile(message, this.GetFullFilePath(file), outputFileMessage, maxFileSizeMB);
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
                this.SendOrcaFile(message, OrcaJobFile.OutputFile);
            }
        }

        this.SendOrcaFile(message, OrcaJobFile.OutputFile);
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
        const regexPatternPAL = /PAL(\d+)/;
        const regexPatternNPROCS = /nprocs\s+(\d+)/i;
        let match;

        if (file.includes("nprocs"))
            match = file.match(regexPatternNPROCS);
        else
            match = file.match(regexPatternPAL);

        if (match && match[1])
            return parseInt(match[1]);
        else
            return 1; 
    }
}

export default OrcaJob;