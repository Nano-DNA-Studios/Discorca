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
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("./OrcaBotDataManager"));
const OrcaJobFile_1 = __importDefault(require("./OrcaJobFile"));
const fs_1 = __importDefault(require("fs"));
const OrcaJobManager_1 = __importDefault(require("./OrcaJobManager"));
class OrcaJob extends dna_discord_framework_1.Job {
    /**
     * Sets the Job Name
     * @param jobName The Name of the Job / Orca Input File Supplied (Without File Extension)
     */
    constructor(jobName, commandUser) {
        super(jobName.split(".")[0], commandUser);
        /* <inheritdoc> */
        this.JobGlobalDirectory = "/DiscorcaJobs";
        /* <inheritdoc> */
        this.JobManager = new OrcaJobManager_1.default();
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
    GetFileCopyCommand(file) {
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        const filePath = `${this.JobManager.HostJobDirectory}/${this.JobName}/${this.GetFileName(file)}`;
        const syncInfo = dataManager.GetSCPInfo(this.JobAuthor);
        return dna_discord_framework_1.SSHManager.GetSCPCommand(syncInfo, filePath, syncInfo.DownloadLocation);
    }
    /**
     * Runs the Orca Calculation Job
     */
    RunJob() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            yield new dna_discord_framework_1.BashScriptRunner().RunLocally(`/Orca/orca  ${this.GetFullFilePath(OrcaJobFile_1.default.InputFile)} > ${this.GetFullFilePath(OrcaJobFile_1.default.OutputFile)}`, true, this.JobDirectory).catch(e => {
                console.log(e);
                e.name += `: Run Job (${this.JobName})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
            });
            this.JobFinished = true;
        });
    }
    /**
     * Creates the Compressed Archive File
     */
    ArchiveJob(dataManager) {
        return __awaiter(this, void 0, void 0, function* () {
            let runner = new dna_discord_framework_1.BashScriptRunner();
            yield runner.RunLocally(`tar -zcvf  ${this.GetFullFilePath(OrcaJobFile_1.default.ArchiveFile)} -C  ${this.JobManager.JobLibraryDirectory} ${this.JobName}`).catch(e => {
                e.name += `: Archive Job (${this.JobName})`;
                dataManager.AddErrorLog(e);
            });
        });
    }
    /**
     * Gets the Full Path to the Specified File
     * @param fileName The Name of the Job File
     * @returns The Full Path to the Orca Job File
     */
    GetFullFilePath(fileName) {
        switch (fileName) {
            case OrcaJobFile_1.default.InputFile:
                return `${this.JobDirectory}/${this.InputFileName}`;
            case OrcaJobFile_1.default.OutputFile:
                return `${this.JobDirectory}/${this.OutputFileName}`;
            case OrcaJobFile_1.default.XYZFile:
                return `${this.JobDirectory}/${this.XYZFileName}`;
            case OrcaJobFile_1.default.TrajectoryXYZFile:
                return `${this.JobDirectory}/${this.TrjXYZFileName}`;
            case OrcaJobFile_1.default.ArchiveFile:
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
    GetFileName(fileName) {
        switch (fileName) {
            case OrcaJobFile_1.default.InputFile:
                return this.InputFileName;
            case OrcaJobFile_1.default.OutputFile:
                return this.OutputFileName;
            case OrcaJobFile_1.default.XYZFile:
                return this.XYZFileName;
            case OrcaJobFile_1.default.TrajectoryXYZFile:
                return this.TrjXYZFileName;
            case OrcaJobFile_1.default.ArchiveFile:
                return this.ArchiveFile;
            default:
                return "";
        }
    }
    GetFileFriendlyName(fileName) {
        switch (fileName) {
            case OrcaJobFile_1.default.InputFile:
                return "Input File";
            case OrcaJobFile_1.default.OutputFile:
                return "Output File";
            case OrcaJobFile_1.default.XYZFile:
                return "XYZ File";
            case OrcaJobFile_1.default.TrajectoryXYZFile:
                return "Trajectory XYZ File";
            case OrcaJobFile_1.default.ArchiveFile:
                return "Archive File";
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
    PingUser(message, jobsUser) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.JobSuccess)
                yield jobsUser.send(`${jobsUser} Server has completed the Orca Calculation ${this.JobName} :white_check_mark: \n It can be found here : ${message.GetLink()}`);
            else
                yield jobsUser.send(`${jobsUser} Server has encoutered a problem with the Orca Calculation ${this.JobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${message.GetLink()}`);
        });
    }
    /**
     * Sends all quickly accessible Files to the User
     * @param message
     */
    SendAllFiles(message, dataManager) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ArchiveJob(dataManager);
            //this.SendFile(message, this.GetFullFilePath(OrcaJobFile.InputFile), `The Input File is too large, download it using the following command ${this.GetFileCopyCommand(OrcaJobFile.InputFile)}`, maxFileSizeMB);
            this.SendOrcaFile(message, OrcaJobFile_1.default.OutputFile);
            this.SendOrcaFile(message, OrcaJobFile_1.default.XYZFile);
            this.SendOrcaFile(message, OrcaJobFile_1.default.TrajectoryXYZFile);
            this.SendOrcaFile(message, OrcaJobFile_1.default.ArchiveFile);
        });
    }
    SendOrcaFile(message, file) {
        return __awaiter(this, void 0, void 0, function* () {
            let outputFileMessage = `The ${this.GetFileFriendlyName(file)} is too large, download it using the following command ${this.GetFileCopyCommand(file)}`;
            let maxFileSizeMB = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB;
            this.SendFile(message, this.GetFullFilePath(file), outputFileMessage, maxFileSizeMB);
        });
    }
    /*
    public async SendFile(message: BotCommunication, filePath: string, largeFileMessage: string, maxFileSizeMB: number): Promise<void> {
        if (!fs.existsSync(filePath))
            return

        if (this.IsFileLarger(filePath, maxFileSizeMB, SizeFormat.MB)) {
            let outputFileMessage = largeFileMessage;

            if (message.content?.includes(outputFileMessage))
                return;

            let valIndex = message.files?.indexOf(filePath);
            if (valIndex != -1 && typeof valIndex !== 'undefined')
                message.files?.splice(valIndex, 1);
            message.AddMessage(outputFileMessage);
        }
        else
            message.AddFile(filePath);
    }
            */
    /**
     * Sends an individual File to the Message for the Job
     * @param message
     * @param file
     */
    /*
    public async SendFile(message: BotCommunication, file: OrcaJobFile): Promise<void> {
        const filePath = this.GetFullFilePath(file);

        if (!fs.existsSync(filePath))
            return

        if (this.IsFileLarger(filePath, BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB, SizeFormat.MB)) {
            let outputFileMessage = `The ${this.GetFileFriendlyName(file)} is too large, download it using the following command ${this.GetFileCopyCommand(file)}`;

            if (message.content?.includes(outputFileMessage))
                return;

            let valIndex = message.files?.indexOf(filePath);
            if (valIndex != -1 && typeof valIndex !== 'undefined')
                message.files?.splice(valIndex, 1);
            message.AddMessage(outputFileMessage);
        }
        else
            message.AddFile(filePath);
    }
            */
    /**
     * Starts a loop that Sends the latest version of the Output file and uploads it to Discord.
     * @param message The Bot Communication Message the file will be uploaded to
     */
    UpdateOutputFile(message) {
        return __awaiter(this, void 0, void 0, function* () {
            let count = 0;
            while (!this.JobFinished) {
                yield new Promise(resolve => {
                    setTimeout(() => {
                        count += 1;
                        resolve(undefined); // Call the resolve function to resolve the promise
                    }, 100);
                });
                if (count > 100) {
                    count = 0;
                    this.SendOrcaFile(message, OrcaJobFile_1.default.OutputFile);
                }
            }
            this.SendOrcaFile(message, OrcaJobFile_1.default.OutputFile);
        });
    }
    JobResourceUsage() {
        let record = { "Cores": this.GetNumberOfCores() };
        return record;
    }
    /**
     * Extracts the Number of Cores that will be used from the Input File
     * @param job The OrcaJob to Analyze
     * @returns The Number of Cores that will be used
     */
    GetNumberOfCores() {
        /*
        const file = fs.readFileSync(this.GetFullFilePath(OrcaJobFile.InputFile), 'utf8');
        const regexPatternPAL = /PAL(\d+)/i;  // Assuming the format is PAL followed by the number
        const regexPatternNPROCS = /nprocs\s+(\d+)/i;  // No global flag needed, `i` for case-insensitive match
        let match;

        // Check for nprocs first
        if (file.includes("nprocs")) {
            match = regexPatternNPROCS.exec(file);  // Use `exec()` for capturing groups
        } else {
            console.log("No nprocs found, trying PAL");
            match = regexPatternPAL.exec(file);
        }

        console.log(match);  // For debugging: shows the match result

        if (match && match[1]) {
            return parseInt(match[1]);  // Extract the captured group with the number
        } else {
            return 1;  // Default value if no match
        }
            */
        const file = fs_1.default.readFileSync(this.GetFullFilePath(OrcaJobFile_1.default.InputFile), 'utf8');
        const regexPatternPAL = /PAL(\d+)/;
        const regexPatternNPROCS = /nprocs\s+(\d+)/i;
        let match;
        if (file.includes("nprocs"))
            match = file.match(regexPatternNPROCS);
        else
            match = file.match(regexPatternPAL);
        if (match)
            return parseInt(match[1]);
        else
            return 1;
    }
}
exports.default = OrcaJob;
