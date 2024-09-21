import IJob from "./IJob";
import fs from "fs";

abstract class Job implements IJob {

    /* <inheritdoc> */
    abstract JobDefaultDirectory: string;

    /* <inheritdoc> */
    abstract JobCategory: string;

    /* <inheritdoc> */
    public JobName: string;

    /* <inheritdoc> */
    public StartTime: number;

    /* <inheritdoc> */
    public JobDirectory: string = "";

    /* <inheritdoc> */
    public JobArchiveDirectory: string = "";

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

    /**
     * Sets the Directories for the Job
     */
    SetDirectories(): void {

        if (this.JobDefaultDirectory === "")
            throw new Error("Job Default Directory is not Set");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set");

        this.JobDirectory = this.JobDefaultDirectory + "/" + this.JobCategory + "/" + "Job" + "/" + this.JobName;
        this.JobArchiveDirectory = this.JobDefaultDirectory + "/" + this.JobCategory + "/" + "Archive" + "/" + this.JobName;

        console.log("Job Directory: " + this.JobDirectory);
        console.log("Job Archive Directory: " + this.JobArchiveDirectory);
    }

    /* <inheritdoc> */
    CreateDirectories() {

        if (this.JobDirectory === "")
            throw new Error("Job Directory is not Set");

        if (this.JobArchiveDirectory === "")
            throw new Error("Job Archive Directory is not Set");

        if (fs.existsSync(this.JobDirectory))
            fs.rmSync(this.JobDirectory, { recursive: true , force: true });

        if (fs.existsSync(this.JobArchiveDirectory))
            fs.rmSync(this.JobArchiveDirectory, { recursive: true , force: true });

        fs.mkdirSync(this.JobDirectory, { recursive: true });
        fs.mkdirSync(this.JobArchiveDirectory, { recursive: true });
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