import OrcaJob from "./OrcaJob";
import fs from "fs";
import OrcaJobFile from "./OrcaJobFile";

/**
 * A Class to Describe the Job and it's resources
 */
class OrcaJobDescription {

    /**
     * The Name of the Job to Describe
     */
    public JobName: string;

    /**
     * The Number of Cores Allocated to the Orca Calculation
     */
    public OccupiedCores: number;

    /**
     * The Time the Job Started
     */
    public StartTime: number;

    /**
     * Default Constructor
     * @param job The OrcaJob to Describe
     */
    constructor(job: OrcaJob) {
        this.JobName = job.JobName;
        this.OccupiedCores = this.GetNumberOfCores(job);
        this.StartTime = job.StartTime;
    }

    /**
     * Extracts the Number of Cores that will be used from the Input File
     * @param job The OrcaJob to Analyze
     * @returns The Number of Cores that will be used
     */
    private GetNumberOfCores(job: OrcaJob): number {
        const file = fs.readFileSync(job.GetFullFilePath(OrcaJobFile.InputFile), 'utf8');
        const regexPattern = /PAL(\d+)/;
        const match = file.match(regexPattern);

        if (match)
            return parseInt(match[1]);
        else
            return 1;
    }

    /**
     * Gets the Elapsed Time since the Job Started in String format
     * @returns The Elapsed Time in Hours and Minutes
     */
    public GetElapsedTime(): string {
        const now = Date.now();
        const elapsed = new Date(now - this.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();

        if (hours > 0)
            return `${hours} h:${minutes} m`;
        else
            return `${minutes} m`;
    }
}

export default OrcaJobDescription;