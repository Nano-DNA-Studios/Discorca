"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
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
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    get ArchiveDirectory() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    get JobLibraryDirectory() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
    }
    /* <inheritdoc> */
    get ArchiveLibraryDirectory() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }
    get JobRelativeDirectory() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        return this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
    }
    get ArchiveRelativeDirectory() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");
        return this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
    }
    /* <inheritdoc> */
    /*
   SetDirectories(): void {

       if (this.JobGlobalDirectory === "")
           throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

       if (this.JobCategory === "")
           throw new Error("Job Category is not Set");

       if (this.HostArchiveDirectory === "")
           throw new Error("Host Archive Directory is not Set");

       //this.JobDirectory = this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
       //this.JobArchiveDirectory = this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
      // this.JobPath = this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
      // this.ArchivePath = this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;


       console.log("Job Directory: " + this.JobDirectory);
       console.log("Job Archive Directory: " + this.ArchiveDirectory);
       console.log("Job Path: " + this.JobLibraryDirectory);
       console.log("Archive Path: " + this.ArchiveLibraryDirectory);
   }
       */
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
        console.log("Job Directory: " + this.JobDirectory);
        console.log("Job Archive Directory: " + this.ArchiveDirectory);
        console.log("Job Path: " + this.JobLibraryDirectory);
        console.log("Archive Path: " + this.ArchiveLibraryDirectory);
        if (!fs_1.default.existsSync(this.JobDirectory))
            //fs.rmSync(this.JobDirectory, { recursive: true , force: true });
            fs_1.default.mkdirSync(this.JobDirectory, { recursive: true });
        if (!fs_1.default.existsSync(this.ArchiveDirectory))
            //fs.rmSync(this.ArchiveDirectory, { recursive: true , force: true });
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
}
/* <inheritdoc> */
Job.JobSubdirectory = "Job";
/* <inheritdoc> */
Job.ArchiveSubdirectory = "Archive";
exports.default = Job;
