"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
/**
 * Command that Runs an Orca Calculation on the Device the Bot is hosted by
 */
class Orca extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "orca";
        /* <inheritdoc> */
        this.CommandDescription = "Runs an Orca Calculation on the Server";
        /* <inheritdoc> */
        this.IsEphemeralResponse = false;
        /**
         * The Location a new Orca Job will be saved to
         */
        this.SaveLocation = "/OrcaJobs";
        /**
         * The path to the Specific Job Folder. A new Folder is created for the Job so that all files are isolated
         */
        this.JobLocation = "";
        /**
         * The Name of the File sent (Without the file extension)
         */
        this.FileName = "";
        /**
         * The Folder storing all the Archived Jobs that have already Ran. When the Calculation is complete a copy of the Job is created and sent to the Archive
         */
        this.JobArchiveFolder = "";
        /**
         * The Name of the Input File (With Extension)
         */
        this.InputFileName = "";
        /**
         * The Name of the Output File (With Extension)
         */
        this.OutputFileName = "";
        /**
         * The Name of the XYZ File (With Extension)
         */
        this.XYZFileName = "";
        /**
         * The Name of the Trajectory XYZ File (With Extension)
         */
        this.TrjXYZFileName = "";
        /**
         * The Location on the Host Device where the Archive Mount is Stored
         */
        this.HostArchiveLocation = "/homeFAST/OrcaJobArchive";
        /**
         * The SCP copy command stored and ready if needed
         */
        this.CopyCommand = "";
        this.DiscordUser = "";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const data = interaction.options.getAttachment("orcafile");
            if (!data)
                return;
            this.DiscordUser = interaction.user.username;
            this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);
            yield this.SetPaths(data);
            yield this.CreateDirectories();
            yield this.DownloadFile(data.url, path_1.default.join(this.JobLocation, this.InputFileName));
            yield new dna_discord_framework_1.BashScriptRunner().RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);
            this.AddToResponseMessage(":white_check_mark: Server has completed the Orca Calculation :white_check_mark:");
            yield this.SendAllFiles();
        });
        /* <inheritdoc> */
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "orcafile",
                description: "Orca File to Run through Orca",
                required: true,
            },
        ];
        /* <inheritdoc> */
        this.CommandHandler = dna_discord_framework_1.DefaultCommandHandler.Instance();
    }
    /**
     * Sets all the Path and File Name Variables
     * @param data The File Attachment sent through the Command
     */
    SetPaths(data) {
        this.FileName = data.name.split(".")[0];
        this.InputFileName = `${this.FileName}.inp`;
        this.OutputFileName = `${this.FileName}.out`;
        this.XYZFileName = `${this.FileName}.xyz`;
        this.TrjXYZFileName = `${this.FileName}_trj.xyz`;
        this.JobLocation = path_1.default.join(this.SaveLocation, this.FileName);
        this.JobArchiveFolder = `/OrcaJobsArchive/${this.FileName}`;
        this.HostArchiveLocation = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).HOST_DEVICE_MOUNT_LOCATION;
    }
    /**
     * Purges Similar Named Directories and Creates them for the Job
     */
    CreateDirectories() {
        try {
            fs_1.default.rmSync(this.JobLocation, { recursive: true, force: true });
        }
        catch (e) { }
        try {
            fs_1.default.mkdirSync(this.JobLocation, { recursive: true });
        }
        catch (e) { }
        try {
            fs_1.default.rmSync(this.JobArchiveFolder, { recursive: true, force: true });
        }
        catch (e) { }
        try {
            fs_1.default.mkdirSync(this.JobArchiveFolder);
        }
        catch (e) { }
    }
    /**
     * Creates the SCP Copy Command for the User to Copy and use in their Terminal
     * @param fileName The Name of the File to Copy
     * @returns The SCP Copy Command to Download the File
     */
    GetCopyCommand(fileName) {
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        const mountLocation = dataManager.HOST_DEVICE_MOUNT_LOCATION;
        const user = dataManager.SERVER_USER[this.DiscordUser];
        const downloadLocation = dataManager.DOWNLOAD_LOCATION[this.DiscordUser];
        const hostName = dataManager.HOSTNAME;
        const command = `scp ${user}@${hostName}:${mountLocation}/${this.FileName}/${fileName} ${downloadLocation}`;
        return "```" + command + "```";
    }
    /**
     * Sends all the Files to the Bot Response to the User
     */
    SendAllFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SendFile(this.OutputFileName);
            yield this.SendFile(this.XYZFileName);
            yield this.SendFile(this.TrjXYZFileName);
            yield this.SendFullJobArchive();
        });
    }
    /**
     * Adds the Specified file to the Bot Response for the User to Download. If the File is too Large it sends the SCP Command needed to Download
     * @param fileName The Name of the File to Add to the Bot Response
     */
    SendFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let filePath = `${this.JobArchiveFolder}/${fileName}`;
                fs_1.default.copyFileSync(`${this.JobLocation}/${fileName}`, filePath, fs_1.default.constants.COPYFILE_EXCL);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = this.GetFileSize(fileStats);
                if (sizeAndFormat[0] > 5 && sizeAndFormat[1] == "MB") {
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetCopyCommand(fileName)}`);
                }
                else {
                    this.AddFileToResponseMessage(filePath);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     */
    SendFullJobArchive() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileName = `${this.FileName}Full.tar.gz`;
                let filePath = `${this.JobArchiveFolder}/${fileName}`;
                let runner = new dna_discord_framework_1.BashScriptRunner();
                yield runner.RunLocally(`tar -zcvf ${filePath} -C /OrcaJobs ${this.FileName}`);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = this.GetFileSize(fileStats);
                if (sizeAndFormat[0] > 5 && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.GetCopyCommand(fileName)}`);
                else
                    this.AddFileToResponseMessage(filePath);
            }
            catch (e) {
            }
        });
    }
    /**
     * Gets the File Size and Unit
     * @param fileStats The File Stats of the File to Check
     * @returns Returns a Tuple with the File Size associated with the File Size Unit
     */
    GetFileSize(fileStats) {
        let realsize;
        let sizeFormat;
        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        }
        else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        }
        else {
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
    DownloadFile(fileUrl, outputPath) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const response = yield (0, axios_1.default)({
                    method: 'GET',
                    url: fileUrl,
                    responseType: 'stream',
                });
                const writer = fs_1.default.createWriteStream(outputPath);
                response.data.pipe(writer);
                return new Promise((resolve, reject) => {
                    writer.on('finish', resolve);
                    writer.on('error', reject);
                });
            }
            catch (error) {
                console.error(`Failed to download the file: ${error}`);
            }
        });
    }
}
module.exports = Orca;
