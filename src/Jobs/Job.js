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
const axios_1 = __importDefault(require("axios"));
const fs_1 = __importDefault(require("fs"));
class Job {
    constructor(jobName, jobAuthor) {
        this.JobName = jobName;
        this.JobAuthor = jobAuthor;
        this.JobFinished = false;
        this.JobSuccess = true;
        this.StartTime = Date.now();
    }
    /* <inheritdoc> */
    get JobDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    get ArchiveDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    get JobLibraryDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
    }
    /* <inheritdoc> */
    get ArchiveLibraryDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }
    ValidPathValues() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set, Set the value of JobCategory in the Class");
        return true;
    }
    RemoveDirectories() {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");
        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");
        if (fs_1.default.existsSync(this.JobDirectory))
            fs_1.default.rmSync(this.JobDirectory, { recursive: true, force: true });
        if (fs_1.default.existsSync(this.ArchiveDirectory))
            fs_1.default.rmSync(this.ArchiveDirectory, { recursive: true, force: true });
    }
    /* <inheritdoc> */
    CreateDirectories() {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");
        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");
        if (!fs_1.default.existsSync(this.JobDirectory))
            fs_1.default.mkdirSync(this.JobDirectory, { recursive: true });
        if (!fs_1.default.existsSync(this.ArchiveDirectory))
            fs_1.default.mkdirSync(this.ArchiveDirectory, { recursive: true });
    }
    /* <inheritdoc> */
    JobElapsedTime() {
        const now = Date.now();
        const elapsed = new Date(now - this.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();
        const seconds = elapsed.getUTCSeconds();
        if (hours > 0)
            return `${hours} h:${minutes} m:${seconds} s`;
        else if (minutes > 0)
            return `${minutes} m:${seconds} s`;
        else
            return `${seconds} s`;
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
                let writer = fs_1.default.createWriteStream(`${this.JobDirectory}/${attachement.name}`);
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
    * Copies the Job File to the Archive Folder
    * @param file The Name of the Job File
    */
    CopyFilesToArchive() {
        fs_1.default.readdirSync(this.JobDirectory).forEach(file => {
            if (!fs_1.default.existsSync(`${this.ArchiveDirectory}/${file}`))
                try {
                    fs_1.default.copyFileSync(file, `${this.ArchiveDirectory}/${file}`, fs_1.default.constants.COPYFILE_EXCL);
                }
                catch (e) {
                    console.log(e);
                }
        });
    }
}
/* <inheritdoc> */
Job.JobSubdirectory = "Job";
/* <inheritdoc> */
Job.ArchiveSubdirectory = "Archive";
exports.default = Job;
