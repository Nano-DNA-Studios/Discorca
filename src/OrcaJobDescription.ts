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
     * Default Constructor
     * @param job The OrcaJob to Describe
     */
    constructor(job: OrcaJob) {
        this.JobName = job.JobName;
        this.OccupiedCores = this.GetNumberOfCores(job);
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

   
}

export default OrcaJobDescription;