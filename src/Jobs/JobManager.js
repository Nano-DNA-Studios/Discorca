"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Job_1 = __importDefault(require("./Job"));
class JobManager {
    // public  JobLibraryDirectory: string = "";
    //public ArchiveLibraryDirectory: string = "";
    constructor() {
        //this.SetDirectories();
    }
    // SetDirectories ()
    //{
    // this.JobLibraryDirectory = `${this.JobGlobalDirectory}/${this.JobCategory}/${Job.JobSubdirectory}`;
    // this.ArchiveLibraryDirectory = `${this.JobGlobalDirectory}/${this.JobCategory}/${Job.ArchiveSubdirectory}`;
    //}
    /* <inheritdoc> */
    get JobLibraryDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job_1.default.JobSubdirectory;
    }
    /* <inheritdoc> */
    get ArchiveLibraryDirectory() {
        if (!this.ValidPathValues())
            return "";
        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job_1.default.ArchiveSubdirectory;
    }
    ValidPathValues() {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");
        if (this.JobCategory === "")
            throw new Error("Job Category is not Set, Set the value of JobCategory in the Class");
        return true;
    }
}
exports.default = JobManager;
