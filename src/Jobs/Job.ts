import IJob from "./IJob";
import fs from "fs";

abstract class Job implements IJob {

    /* <inheritdoc> */
    abstract JobGlobalDirectory: string;

    /* <inheritdoc> */
    abstract JobCategory: string;

    /* <inheritdoc> */
    abstract HostArchiveDirectory: string;

    /* <inheritdoc> */
    public static JobSubdirectory: string = "Job";

    /* <inheritdoc> */
    public static ArchiveSubdirectory: string = "Archive";

    /* <inheritdoc> */
    public JobName: string;

    /* <inheritdoc> */
    public StartTime: number;

    /* <inheritdoc> */
    //public JobDirectory: string = "";

    /* <inheritdoc> */
    //public JobArchiveDirectory: string = "";

    /* <inheritdoc> */
    //public JobPath: string = "";

    /* <inheritdoc> */
    //public ArchivePath: string = "";

    /* <inheritdoc> */
    public JobAuthor: string;

    /* <inheritdoc> */
    public JobFinished: boolean;

    /* <inheritdoc> */
    public JobSuccess: boolean;

    constructor(jobName: string, jobAuthor: string) {
        this.JobName = jobName;
        this.JobAuthor = jobAuthor;
        this.JobFinished = false;
        this.JobSuccess = true;
        this.StartTime = Date.now();
    }

    /* <inheritdoc> */
    get JobDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
    }

    /* <inheritdoc> */
    get ArchiveDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
    }

    /* <inheritdoc> */
    get JobLibraryDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
    }

    /* <inheritdoc> */
    get ArchiveLibraryDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }

    get JobRelativeDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
    }

    get ArchiveRelativeDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
    }

    /*
    get JobRelativeLibraryDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobCategory + "/" + Job.JobSubdirectory;
    }

    get ArchiveRelativeLibraryDirectory(): string {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        return this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }
        */

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

    public RemoveDirectories(): void {
        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");

        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");

        if (fs.existsSync(this.JobDirectory))
            fs.rmSync(this.JobDirectory, { recursive: true, force: true });

        if (fs.existsSync(this.ArchiveDirectory))
            fs.rmSync(this.ArchiveDirectory, { recursive: true, force: true });
    }


    /* <inheritdoc> */
    public CreateDirectories() {

        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set, Run SetDirectories() beforehand");

        if (this.ArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set, Run SetDirectories() beforehand");

        console.log("Job Directory: " + this.JobDirectory);
        console.log("Job Archive Directory: " + this.ArchiveDirectory);
        console.log("Job Path: " + this.JobLibraryDirectory);
        console.log("Archive Path: " + this.ArchiveLibraryDirectory);

        if (!fs.existsSync(this.JobDirectory))
            //fs.rmSync(this.JobDirectory, { recursive: true , force: true });
            fs.mkdirSync(this.JobDirectory, { recursive: true });

        if (!fs.existsSync(this.ArchiveDirectory))
            //fs.rmSync(this.ArchiveDirectory, { recursive: true , force: true });
            fs.mkdirSync(this.ArchiveDirectory, { recursive: true });
    }

    /* <inheritdoc> */
    public JobElapsedTime(): string {
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

    /* <inheritdoc> */
    public abstract JobResourceUsage(): Record<string, number>;
}

export default Job;