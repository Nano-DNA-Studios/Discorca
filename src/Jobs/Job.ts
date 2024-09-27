import axios from "axios";
import IJob from "./IJob";
import fs from "fs";
import { Attachment } from "discord.js";
import JobManager from "./JobManager";
import SizeFormat from "./SizeFormat";

abstract class Job implements IJob {

    /* <inheritdoc> */
    //abstract JobGlobalDirectory: string;

    /* <inheritdoc> */
    //abstract JobCategory: string;

    /* <inheritdoc> */
    public abstract JobManager: JobManager;

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

    //public JobDirectory: string = "";

    //public ArchiveDirectory: string = "";

    constructor(jobName: string, jobAuthor: string) {
        this.JobName = jobName;
        this.JobAuthor = jobAuthor;
        this.JobFinished = false;
        this.JobSuccess = true;
        this.StartTime = Date.now();
        //this.SetDirectories();
    }

    //public SetDirectories() {
    //    this.JobDirectory = this.JobManager.JobLibraryDirectory + "/" + this.JobName;
    //    this.ArchiveDirectory = this.JobManager.ArchiveLibraryDirectory + "/" + this.JobName;
    //}

    /* <inheritdoc> */
    get JobDirectory(): string {
        return this.JobManager.JobLibraryDirectory + "/" + this.JobName;
    }
        
    /* <inheritdoc> */
    get ArchiveDirectory(): string {
        return this.JobManager.ArchiveLibraryDirectory + "/" + this.JobName;
    }

    //SetDirectories() {
        //this.JobDirectory = `${this.JobManager.JobLibraryDirectory}/${this.JobName}`;
        //this.ArchiveDirectory = `${this.JobManager.ArchiveLibraryDirectory}/${this.JobName}`;
   // }

    /* <inheritdoc> */
    /*
    get JobLibraryDirectory(): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.JobSubdirectory;
    }
        */

    /* <inheritdoc> */
    /*
    get ArchiveLibraryDirectory(): string {
        if (!this.ValidPathValues())
            return "";

        return this.JobGlobalDirectory + "/" + this.JobCategory + "/" + Job.ArchiveSubdirectory;
    }
        */

    /* <inheritdoc> */
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

    /* <inheritdoc> */
    public async DownloadFiles(attachments: (Attachment | null)[]) {

        if (!attachments)
            return

        for (let i = 0; i < attachments.length; i++) {
            await this.DownloadFile(attachments[i]);
        }
    }

    /* <inheritdoc> */
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

    /* <inheritdoc> */
    public CopyFilesToArchive() {
        fs.readdirSync(this.JobDirectory).forEach(file => {
            if (!fs.existsSync(`${this.ArchiveDirectory}/${file}`))
                try {
                    fs.copyFileSync(file, `${this.ArchiveDirectory}/${file}`, fs.constants.COPYFILE_EXCL);
                } catch (e) { console.log(e); }
        });
    }

    /* <inheritdoc> */
    
    GetFileSize(filePath: string): [number, string] {

        if (!fs.existsSync(filePath))
            return [0, "B"];

        const fileStats = fs.statSync(filePath);

        let realsize;
        let sizeFormat;

        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        } else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        } else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }

        return [realsize, sizeFormat];
    }

    IsFileLarger (filePath: string, maxSize: number, sizeFormat: SizeFormat): boolean {

        if (!fs.existsSync(filePath))
            return false;

        let size = fs.statSync(filePath).size;

        if (size > maxSize * sizeFormat)
            return true;
        else 
            return false;
    }
}

export default Job;