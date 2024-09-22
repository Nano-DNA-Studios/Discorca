"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
class Job {
    constructor(jobName, jobAuthor) {
        /* <inheritdoc> */
        this.JobDirectory = "";
        /* <inheritdoc> */
        this.JobArchiveDirectory = "";
        this.JobName = jobName;
        this.JobAuthor = jobAuthor;
        this.JobFinished = false;
        this.JobSuccess = true;
        this.StartTime = Date.now();
    }
    /**
     * Sets the Directories for the Job
     */
    SetDirectories() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        if (this.HostArchiveDirectory === "")
            throw new Error("Host Archive Directory is not Set");
        this.JobDirectory = this.JobGlobalDirectory + "/" + this.JobCategory + "/" + "Job" + "/" + this.JobName;
        this.JobArchiveDirectory = this.JobGlobalDirectory + "/" + this.JobCategory + "/" + "Archive" + "/" + this.JobName;
        console.log("Job Directory: " + this.JobDirectory);
        console.log("Job Archive Directory: " + this.JobArchiveDirectory);
    }
    /* <inheritdoc> */
    CreateDirectories() {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");
        if (this.JobArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");
        if (fs_1.default.existsSync(this.JobDirectory))
            fs_1.default.rmSync(this.JobDirectory, { recursive: true, force: true });
        if (fs_1.default.existsSync(this.JobArchiveDirectory))
            fs_1.default.rmSync(this.JobArchiveDirectory, { recursive: true, force: true });
        fs_1.default.mkdirSync(this.JobDirectory, { recursive: true });
        fs_1.default.mkdirSync(this.JobArchiveDirectory, { recursive: true });
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
}
exports.default = Job;
