

/**
 * Insterface that Describes a Job
 */
interface IJob {

    /**
     * Name of the Job
     */
    JobName: string;

    /**
     * The Start Time of the Job
     */
    StartTime: number;

    /**
     * The Job Catergory, determines the name of the folder
     */
    JobCategory: string;

    /**
     * The Directory the Job is Stored in
     */
    JobDirectory: string;

    /**
     * The Global Directory for Jobs, Where all Catergories of Jobs will be Stored, Must be an Exact Path
     */
    JobGlobalDirectory: string;

    /**
     * The Directory the Job Archive is Stored in
     */
    JobArchiveDirectory: string;

    /**
     * The Exact Path to the Job Directory on the Host Device (Where the Job will be Copied From as a Mounted Directory)
     */
    HostArchiveDirectory: string;

    /**
     * The Author / Creator of the Job, Just the Discord User Name
     */
    JobAuthor : string;

    /**
     * Boolean Flag to Indicate if the Job has Finished
     */
    JobFinished: boolean;

    /*
     * Boolean Flag to Indicate if the Job was Successful
     */
    JobSuccess: boolean;

    /**
     * The Job 
     */
    JobElapsedTime (): string;

    /**
     * The Resource Usage of the Job
     */
    JobResourceUsage (): Record<string, number>;

    /**
     * Sets the Job and Archive Directories, Must have the JobDefaultDirectory and JobCategory Set beforehand
     */
    SetDirectories(): void;

    /**
     * Creates the Job and Archive Directories, Must have Run SetDirectories() beforehand
     */
    CreateDirectories(): void;
}

export default IJob;