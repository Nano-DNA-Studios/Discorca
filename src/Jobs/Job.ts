import axios from "axios";
import IJob from "./IJob";
import fs from "fs";
import { Attachment } from "discord.js";

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
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory + "/" + this.JobName;
    }

    /* <inheritdoc> */
    get ArchiveDirectory(): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory + "/" + this.JobName;
    }

    /* <inheritdoc> */
    get JobLibraryDirectory(): string {
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

    private ValidPathValues (): boolean {
        if (this.JobGlobalDirectory === "")
            throw new Error("Job Default Directory is not Set, Set the values of JobGlobalDirectory in the Class");

        if (this.JobCategory === "")
            throw new Error("Job Category is not Set, Set the value of JobCategory in the Class");
    
        return true;
    }

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

        if (!fs.existsSync(this.JobDirectory))
            fs.mkdirSync(this.JobDirectory, { recursive: true });

        if (!fs.existsSync(this.ArchiveDirectory))
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

    /**
     * Downloads all the Files Uploaded to Discorca for a Orca Calculation
     * @param attachments 
     */
    public async DownloadFiles(attachments: (Attachment | null)[]) {

        if (!attachments)
            return

        for (let i = 0; i < attachments.length; i++) {
            await this.DownloadFile(attachments[i]);
        }
    }

    /**
    * Simple function to download a file from a URL
    * @param attachement The Attachment to Download
    */
    public async DownloadFile(attachement: Attachment | null) {

        if (!attachement)
            return

        try {
            const response = await axios({
                method: 'GET',
                url: attachement.url,
                responseType: 'stream',
            });

            let writer = fs.createWriteStream(`${this.JobDirectory}/${attachement.name}`);

            await response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }

     /**
     * Copies the Job File to the Archive Folder
     * @param file The Name of the Job File
     */
     public CopyFilesToArchive() {
        fs.readdirSync(this.JobDirectory).forEach(file => {
            if (!fs.existsSync(`${this.ArchiveDirectory}/${file}`))
                try {
                    fs.copyFileSync(file, `${this.ArchiveDirectory}/${file}`, fs.constants.COPYFILE_EXCL);
                } catch (e) { console.log(e); }
        });
    }
}

export default Job;