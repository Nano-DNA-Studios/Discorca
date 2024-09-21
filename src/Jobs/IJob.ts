

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
     * The Default Directory for Jobs
     */
    JobDefaultDirectory: string;

    /**
     * The Directory the Job Archive is Stored in
     */
    JobArchiveDirectory: string;

    /**
     * The Author of the Job
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
     * Creates the Job and Archive Directories
     */
    CreateDirectories(): void;
}

export default IJob;