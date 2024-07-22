import OrcaJobFile from "./OrcaJobFile";
import fs from "fs";

interface IOrcaJob {
    /**
    * The Name of the File sent (Without the file extension)
    */
    JobName: string;

    /**
     * The Archive File That is Generated from the Orca Calculation
     */
    ArchiveFile: string;

    /**
     * The Path/Directory to the Job Folder containing all Jobs
     */
    JobDirectory: string;

    /**
    * The path to the Specific Job Folder. A new Folder is created for the Job so that all files are isolated
    */
    OrcaJobDirectory: string;

    /**
     * The Directory that Stores all Archive Folders
     */
    JobArchiveDirectory: string;

    /**
     * The Folder storing all the Archived Jobs that have already Ran. When the Calculation is complete a copy of the Job is created and sent to the Archive
     */
    OrcaJobArchiveDirectory: string;

    /**
     * The Name of the Input File (With Extension)
     */
    InputFileName: string;

    /**
     * The Name of the Output File (With Extension)
     */
    OutputFileName: string;

    /**
     * The Name of the XYZ File (With Extension)
     */
    XYZFileName: string;

    /**
     * The Name of the Trajectory XYZ File (With Extension)
     */
    TrjXYZFileName: string;

    /**
     * The Directory on the Host Device where the Archive Mount is Stored
     */
    HostArchiveDirectory: string;

    /**
     * The Start Time of the Job
     */
    StartTime: number;

    /**
    * Purges Similar Named Directories and Creates them for the Job
    */
    CreateDirectories(): void;

    /**
    * Creates the SCP Copy Command for the User to Copy and use in their Terminal
    * @param fileName The Name of the File to Copy
    * @returns The SCP Copy Command to Download the File
    */
    GetCopyCommand(file: OrcaJobFile, discordUser: string): string;

    /**
     * Gets the File Size and Unit 
     * @param fileStats The File Stats of the File to Check
     * @returns Returns a Tuple with the File Size associated with the File Size Unit
     */
    GetFileSize(fileStats: fs.Stats): [Number, string];

    /**
    * Simple function to download a file from a URL
    * @param fileUrl The URL of the file to download
    * @param outputPath The Path to download the file to
    * @returns A promise telling when the download is complete
    */
    DownloadFile(fileUrl: string, jobFileType: OrcaJobFile): void;

    /**
     * Runs the Orca Calculation Job
     */
    RunJob(): Promise<void>;

    /**
     * Creates the Compressed Archive File
     */
    ArchiveJob(): void;

    /**
     * Gets the Full Path to the Specified File
     * @param fileName The Name of the Job File
     * @returns The Full Path to the Orca Job File
     */
    GetFullFilePath(fileName: OrcaJobFile): string

    /**
     * Gets the Full Path to the File Relative to the Host Devices Mounted Location for all Archives
     * @param fileName The Name of the Job File
     * @returns The Full Path to the Mounted File Path
     */
    GetFullMountFilePath(fileName: OrcaJobFile): string

    /**
     * Gets the Full Name (With extension) of the Job File
     * @param fileName The Name of the Job File
     * @returns The Full Name of the Orca Job File
     */
    GetFileName(fileName: OrcaJobFile): string;

    /**
     * Copies the Job File to the Archive Folder
     * @param file The Name of the Job File
     */
    CopyToArchive(file: OrcaJobFile): void;
}

export default IOrcaJob;