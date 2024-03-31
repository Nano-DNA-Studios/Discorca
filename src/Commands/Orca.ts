import { OptionTypesEnum, BotDataManager, Command, BashScriptRunner, DefaultCommandHandler, BotData } from "dna-discord-framework"
import { Attachment, CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import fs from "fs";
import fsp from "fs/promises"
import path from "path";
import axios from "axios";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Runs an Orca Calculation on the Device the Bot is hosted by
 */
class Orca extends Command {
    /* <inheritdoc> */
    CommandName = "orca";

    /* <inheritdoc> */
    CommandDescription = "Runs an Orca Calculation on the Server";

    /* <inheritdoc> */
    IsEphemeralResponse = false;

    /**
     * The Location a new Orca Job will be saved to
     */
    SaveLocation: string = "/OrcaJobs";

    /**
     * The path to the Specific Job Folder. A new Folder is created for the Job so that all files are isolated
     */
    JobLocation: string = "";

    /**
     * The Name of the File sent (Without the file extension)
     */
    FileName: string = "";

    /**
     * The Folder storing all the Archived Jobs that have already Ran. When the Calculation is complete a copy of the Job is created and sent to the Archive
     */
    JobArchiveFolder: string = "";

    /**
     * The Name of the Input File (With Extension)
     */
    InputFileName: string = "";

    /**
     * The Name of the Output File (With Extension)
     */
    OutputFileName: string = "";

    /**
     * The Name of the XYZ File (With Extension)
     */
    XYZFileName: string = "";

    /**
     * The Name of the Trajectory XYZ File (With Extension)
     */
    TrjXYZFileName: string = "";

    /**
     * The Location on the Host Device where the Archive Mount is Stored
     */
    HostArchiveLocation = "/homeFAST/OrcaJobArchive";

    /**
     * The SCP copy command stored and ready if needed
     */
    CopyCommand: string = "";

    DiscordUser: string = "";

    /* <inheritdoc> */
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const data = interaction.options.getAttachment("orcafile");

        if (!data)
            return;

        this.DiscordUser = interaction.user.username;

        this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);

        await this.SetPaths(data);
        await this.CreateDirectories();
        await this.DownloadFile(data.url, path.join(this.JobLocation, this.InputFileName));
        await new BashScriptRunner().RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);

        this.AddToResponseMessage(":white_check_mark: Server has completed the Orca Calculation :white_check_mark:");

        await this.SendAllFiles();
    };

    /* <inheritdoc> */
    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "orcafile",
            description: "Orca File to Run through Orca",
            required: true,
        },
    ];

    /* <inheritdoc> */
    CommandHandler = DefaultCommandHandler.Instance();

    /**
     * Sets all the Path and File Name Variables
     * @param data The File Attachment sent through the Command
     */
    SetPaths(data: Attachment) {
        this.FileName = data.name.split(".")[0];
        this.InputFileName = `${this.FileName}.inp`;
        this.OutputFileName = `${this.FileName}.out`;
        this.XYZFileName = `${this.FileName}.xyz`;
        this.TrjXYZFileName = `${this.FileName}_trj.xyz`;
        this.JobLocation = path.join(this.SaveLocation, this.FileName);
        this.JobArchiveFolder = `/OrcaJobsArchive/${this.FileName}`;
        this.HostArchiveLocation = BotData.Instance(OrcaBotDataManager).HOST_DEVICE_MOUNT_LOCATION;
    }

    /**
     * Purges Similar Named Directories and Creates them for the Job
     */
    CreateDirectories() {
        try { fs.rmSync(this.JobLocation, { recursive: true, force: true }); } catch (e) { }
        try { fs.mkdirSync(this.JobLocation, { recursive: true }); } catch (e) { }

        try { fs.rmSync(this.JobArchiveFolder, { recursive: true, force: true }); } catch (e) { }
        try { fs.mkdirSync(this.JobArchiveFolder); } catch (e) { }
    }

    /**
     * Creates the SCP Copy Command for the User to Copy and use in their Terminal
     * @param fileName The Name of the File to Copy
     * @returns The SCP Copy Command to Download the File
     */
    GetCopyCommand(fileName: string): string {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const mountLocation = dataManager.HOST_DEVICE_MOUNT_LOCATION;
        const user = dataManager.SERVER_USER[this.DiscordUser];
        const downloadLocation = dataManager.DOWNLOAD_LOCATION[this.DiscordUser];
        const hostName = dataManager.HOSTNAME;
        const command = `scp ${user}@${hostName}:${mountLocation}/${this.FileName}/${fileName} ${downloadLocation}`;

        return "```" + command + "```"
    }

    /**
     * Sends all the Files to the Bot Response to the User
     */
    async SendAllFiles() {
        await this.SendFile(this.OutputFileName);
        await this.SendFile(this.XYZFileName);
        await this.SendFile(this.TrjXYZFileName);
        await this.SendFullJobArchive();
    }

    /**
     * Adds the Specified file to the Bot Response for the User to Download. If the File is too Large it sends the SCP Command needed to Download
     * @param fileName The Name of the File to Add to the Bot Response
     */
    async SendFile(fileName: string) {
        try {
            let filePath = `${this.JobArchiveFolder}/${fileName}`;

            fs.copyFileSync(`${this.JobLocation}/${fileName}`, filePath, fs.constants.COPYFILE_EXCL);

            const fileStats = await fsp.stat(filePath);
            const sizeAndFormat = this.GetFileSize(fileStats);

            if (sizeAndFormat[0] > 5 && sizeAndFormat[1] == "MB") {
                this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetCopyCommand(fileName)}`);
            } else {
                this.AddFileToResponseMessage(filePath);
            }
        } catch (e) {
            console.log(e);
        }
    }

    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     */
    async SendFullJobArchive() {
        try {
            let fileName = `${this.FileName}Full.tar.gz`
            let filePath = `${this.JobArchiveFolder}/${fileName}`
            let runner = new BashScriptRunner();

            await runner.RunLocally(`tar -zcvf ${filePath} -C /OrcaJobs ${this.FileName}`);

            const fileStats = await fsp.stat(filePath);
            const sizeAndFormat = this.GetFileSize(fileStats)

            if (sizeAndFormat[0] > 5 && sizeAndFormat[1] == "MB")
                this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetCopyCommand(fileName)}`);
            else
                this.AddFileToResponseMessage(filePath);

        } catch (e) {

        }
    }

    /**
     * Gets the File Size and Unit 
     * @param fileStats The File Stats of the File to Check
     * @returns Returns a Tuple with the File Size associated with the File Size Unit
     */
    GetFileSize(fileStats: fs.Stats): [number, string] {
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

    /**
     * Simple function to download a file from a URL
     * @param fileUrl The URL of the file to download
     * @param outputPath The Path to download the file to
     * @returns A promise telling when the download is complete
     */
    async DownloadFile(fileUrl: string, outputPath: string) {
        try {
            const response = await axios({
                method: 'GET',
                url: fileUrl,
                responseType: 'stream',
            });

            const writer = fs.createWriteStream(outputPath);

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }
}

export = Orca;