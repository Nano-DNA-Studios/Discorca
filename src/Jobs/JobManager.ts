import SCPInfo from "../SSH/SCPInfo";
import SyncInfo from "../SyncInfo";
import Job from "./Job";


abstract class JobManager {

    /* <inheritdoc> */
    abstract JobGlobalDirectory: string;

    public abstract JobCategory: string;

    public abstract HostArchiveDirectory: string;

    public abstract HostJobDirectory: string;

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
    
    get JobLibraryDirectory (): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
    }
    

    /* <inheritdoc> */
    
    get ArchiveLibraryDirectory(): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }
    

    private ValidPathValues(): boolean {
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

    abstract GetHostArchiveCopyCommand(syncInfo: SyncInfo, jobName: string): string;

    abstract GetHostJobCopyCommand(syncInfo: SyncInfo, jobName: string): string;

    //abstract GetHostArchiveCopyCommand(scpInfo: SCPInfo, jobName : string): string;

    //abstract GetHostJobCopyCommand(scpInfo: SCPInfo, jobName : string): string;



}

export default JobManager;