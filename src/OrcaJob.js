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
const axios_1 = __importDefault(require("axios"));
const OrcaJobFile_1 = __importDefault(require("./OrcaJobFile"));
const fs_1 = __importDefault(require("fs"));
class OrcaJob {
    /**
     * Sets the Job Name
     * @param jobName The Name of the Job / Orca Input File Supplied (Without File Extension)
     */
    constructor(jobName, commandUser) {
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        this.JobSuccess = true;
        this.JobFinished = false;
        this.CommandUser = commandUser;
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
     * Gets the Elapsed Time since the Job Started in String format
     * @returns The Elapsed Time since the Job Started in String format
     */
    GetJobTime() {
        const now = Date.now();
        const elapsed = new Date(now - this.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();
        if (hours > 0)
            return `${hours} h:${minutes} m`;
        else
            return `${minutes} m`;
    }
    /**
    * Purges Similar Named Directories and Creates them for the Job
    */
    CreateDirectories() {
        try {
            fs_1.default.rmSync(this.OrcaJobDirectory, { recursive: true, force: true });
        }
        catch (e) {
            console.log(e);
        }
        try {
            fs_1.default.mkdirSync(this.OrcaJobDirectory, { recursive: true });
        }
        catch (e) {
            console.log(e);
        }
        try {
            fs_1.default.rmSync(this.OrcaJobArchiveDirectory, { recursive: true, force: true });
        }
        catch (e) {
            console.log(e);
        }
        try {
            fs_1.default.mkdirSync(this.OrcaJobArchiveDirectory, { recursive: true });
        }
        catch (e) {
            console.log(e);
        }
    }
    /**
     * Downloads all the Files Uploaded to Discorca for a Orca Calculation
     * @param attachments
     */
    DownloadFiles(attachments) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!attachments)
                return;
            for (let i = 0; i < attachments.length; i++) {
                yield this.DownloadFile(attachments[i]);
            }
        });
    }
    /**
    * Simple function to download a file from a URL
    * @param attachement The Attachment to Download
    */
    DownloadFile(attachement) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!attachement)
                return;
            try {
                const response = yield (0, axios_1.default)({
                    method: 'GET',
                    url: attachement.url,
                    responseType: 'stream',
                });
                let writer = fs_1.default.createWriteStream(`${this.OrcaJobDirectory}/${attachement.name}`);
                yield response.data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
            }
            catch (error) {
                console.error(`Failed to download the file: ${error}`);
            }
        });
    }
    /**
    * Creates the SCP Copy Command for the User to Copy and use in their Terminal
    * @param fileName The Name of the File to Copy
    * @returns The SCP Copy Command to Download the File
    */
    GetCopyCommand(file) {
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        if (!(this.CommandUser in dataManager.DISCORD_USER_TO_SERVER_USER && this.CommandUser in dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION)) {
            const command = `scp serverUser@hostName:${this.GetFullMountFilePath(file)} /Path/on/local/device`;
            return "```" + command + "```";
        }
        const user = dataManager.DISCORD_USER_TO_SERVER_USER[this.CommandUser];
        const downloadLocation = dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION[this.CommandUser];
        const hostName = dataManager.HOSTNAME;
        let command = "";
        if (dataManager.PORT == 0)
            command = `scp ${user}@${hostName}:${this.GetFullMountFilePath(file)} ${downloadLocation}`;
        else
            command = `scp -P ${dataManager.PORT} ${user}@${hostName}:${this.GetFullMountFilePath(file)} ${downloadLocation}`;
        return "```" + command + "```";
    }
    /**
     * Gets the File Size and Unit
     * @param fileStats The File Stats of the File to Check
     * @returns Returns a Tuple with the File Size associated with the File Size Unit
     */
    GetFileSize(fileStats) {
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
    /**
     * Runs the Orca Calculation Job
     */
    RunJob() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            yield new dna_discord_framework_1.BashScriptRunner().RunLocally(`/Orca/orca  ${this.GetFullFilePath(OrcaJobFile_1.default.InputFile)} > ${this.GetFullFilePath(OrcaJobFile_1.default.OutputFile)}`, true, this.OrcaJobDirectory).catch(e => {
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
    ArchiveJob() {
        return __awaiter(this, void 0, void 0, function* () {
            this.CopyFilesToArchive();
            let runner = new dna_discord_framework_1.BashScriptRunner();
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            yield runner.RunLocally(`tar -zcvf  ${this.GetFullFilePath(OrcaJobFile_1.default.ArchiveFile)} -C ${this.JobDirectory} ${this.JobName}`).catch(e => {
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
                return `${this.OrcaJobDirectory}/${this.InputFileName}`;
            case OrcaJobFile_1.default.OutputFile:
                return `${this.OrcaJobDirectory}/${this.OutputFileName}`;
            case OrcaJobFile_1.default.XYZFile:
                return `${this.OrcaJobDirectory}/${this.XYZFileName}`;
            case OrcaJobFile_1.default.TrajectoryXYZFile:
                return `${this.OrcaJobDirectory}/${this.TrjXYZFileName}`;
            case OrcaJobFile_1.default.ArchiveFile:
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
    GetFullMountFilePath(fileName) {
        switch (fileName) {
            case OrcaJobFile_1.default.InputFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.InputFileName}`;
            case OrcaJobFile_1.default.OutputFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.OutputFileName}`;
            case OrcaJobFile_1.default.XYZFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.XYZFileName}`;
            case OrcaJobFile_1.default.TrajectoryXYZFile:
                return `${this.HostArchiveDirectory}/${this.JobName}/${this.TrjXYZFileName}`;
            case OrcaJobFile_1.default.ArchiveFile:
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
    /**
     * Copies the Job File to the Archive Folder
     * @param file The Name of the Job File
     */
    CopyFilesToArchive() {
        fs_1.default.readdirSync(this.OrcaJobDirectory).forEach(file => {
            if (fs_1.default.existsSync(`${this.OrcaJobArchiveDirectory}/${file}`))
                fs_1.default.copyFileSync(file, `${this.OrcaJobArchiveDirectory}/${file}`, fs_1.default.constants.COPYFILE_EXCL);
        });
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
    SendAllFiles(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ArchiveJob();
            this.SendFile(message, OrcaJobFile_1.default.OutputFile);
            this.SendFile(message, OrcaJobFile_1.default.XYZFile);
            this.SendFile(message, OrcaJobFile_1.default.TrajectoryXYZFile);
            this.SendFile(message, OrcaJobFile_1.default.ArchiveFile);
        });
    }
    /**
     * Sends an individual File to the Message for the Job
     * @param message
     * @param file
     */
    SendFile(message, file) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const filePath = this.GetFullFilePath(file);
            if (!fs_1.default.existsSync(filePath))
                return;
            const fileStats = fs_1.default.statSync(filePath);
            const sizeAndFormat = this.GetFileSize(fileStats);
            if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                if (!((_a = message.content) === null || _a === void 0 ? void 0 : _a.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetCopyCommand(OrcaJobFile_1.default.OutputFile)}`)))
                    message.AddMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetCopyCommand(OrcaJobFile_1.default.OutputFile)}`);
            }
            else
                message.AddFile(filePath);
        });
    }
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
                    this.SendFile(message, OrcaJobFile_1.default.OutputFile);
                }
            }
            this.SendFile(message, OrcaJobFile_1.default.OutputFile);
        });
    }
}
exports.default = OrcaJob;
