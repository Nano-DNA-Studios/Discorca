"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SSHManager_1 = __importDefault(require("../SSH/SSHManager"));
const Job_1 = __importDefault(require("./Job"));
class JobManager {
    constructor() {
        //this.SetDirectories();
    }
    //SetDirectories() {
    //    this.JobLibraryDirectory = `${this.JobGlobalDirectory}/${this.JobCategory}/${Job.JobSubdirectory}`;
    //    this.ArchiveLibraryDirectory = `${this.JobGlobalDirectory}/${this.JobCategory}/${Job.ArchiveSubdirectory}`;
    //}
    /* <inheritdoc> */
    get JobLibraryDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job_1.default.JobSubdirectory;
    }
    ///* <inheritdoc> */
    get ArchiveLibraryDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job_1.default.ArchiveSubdirectory;
    }
    /* <inheritdoc> */
    ValidPathValues() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set, Set the value of JobCategory in the Class");
        return true;
    }
    /**
   * Creates the SCP Copy Command for the User to Copy and use in their Terminal
   * @param fileName The Name of the File to Copy
   * @returns The SCP Copy Command to Download the File
   */
    //abstract GetCopyCommand(job: Job): string;
    GetArchiveSyncCommand(syncInfo, destinationPath) {
        return SSHManager_1.default.GetSCPCommand(syncInfo, this.HostArchiveDirectory, destinationPath, true);
    }
    GetHostArchiveCopyCommand(syncInfo, jobName, destinationPath) {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return SSHManager_1.default.GetSCPCommand(syncInfo, path, destinationPath, true);
    }
    GetHostJobCopyCommand(syncInfo, jobName, destinationPath) {
        const path = this.HostJobDirectory + "/" + jobName;
        return SSHManager_1.default.GetSCPCommand(syncInfo, path, destinationPath, true);
    }
}
exports.default = JobManager;
