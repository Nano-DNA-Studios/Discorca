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
//Start works
class Orca extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "orca";
        this.CommandDescription = "Runs an Orca Calculation on the Server";
        this.IsEphemeralResponse = false;
        this.SaveLocation = "/OrcaJobs";
        this.JobLocation = "";
        //CustomCode: string = `/Orca/orca  ${this.JobLocation}/${this.InputFileName}  > ${this.JobLocation}/${this.OutputFileName}`;
        this.FileName = "";
        this.JobArchiveFolder = "";
        this.InputFileName = "";
        this.OutputFileName = "";
        this.XYZFileName = "";
        this.TrjXYZFileName = "";
        this.ECEServerArchive = "/homeFAST/OrcaJobArchive";
        this.CopyCommand = "";
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const data = interaction.options.getAttachment("orcafile");
            if (!data)
                return;
            this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);
            yield this.SetPaths(data);
            yield this.CreateDirectories();
            yield this.downloadFile(data.url, path_1.default.join(this.JobLocation, this.InputFileName));
            yield new dna_discord_framework_1.BashScriptRunner().RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);
            // await runner.RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);
            this.AddToResponseMessage(":white_check_mark: Server has completed the Orca Calculation :white_check_mark:");
            yield this.SendAllFiles();
        });
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "orcafile",
                description: "Orca File to Run through Orca",
                required: true,
            },
        ];
        this.CommandHandler = dna_discord_framework_1.DefaultCommandHandler.Instance();
    }
    SetPaths(data) {
        this.FileName = data.name.split(".")[0];
        this.InputFileName = `${this.FileName}.inp`;
        this.OutputFileName = `${this.FileName}.out`;
        this.XYZFileName = `${this.FileName}.xyz`;
        this.TrjXYZFileName = `${this.FileName}_trj.xyz`;
        this.JobLocation = path_1.default.join(this.SaveLocation, this.FileName);
        this.JobArchiveFolder = `/OrcaJobsArchive/${this.FileName}`;
    }
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
    CreateCopyCommand(fileName) {
        let command = `scp a3dufres@iccad5:${this.ECEServerArchive}/${this.FileName}/${fileName} C:/Users/MrDNA/Downloads`;
        this.CopyCommand = "```" + command + "```";
    }
    SendAllFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.SendFile(this.OutputFileName);
            yield this.SendFile(this.XYZFileName);
            yield this.SendFile(this.TrjXYZFileName);
            yield this.SendFullJobArchive();
        });
    }
    SendFile(fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.CreateCopyCommand(fileName);
                let filePath = `${this.JobArchiveFolder}/${fileName}`;
                fs_1.default.copyFileSync(`${this.JobLocation}/${fileName}`, filePath, fs_1.default.constants.COPYFILE_EXCL);
                const fileStats = yield promises_1.default.stat(filePath);
                let sizeAndFormat = this.GetFileSize(fileStats);
                if (sizeAndFormat[0] > 5 && sizeAndFormat[1] == "MB") {
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.CopyCommand}`);
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
    SendFullJobArchive() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let fileName = `${this.FileName}Full.tar.gz`;
                let filePath = `${this.JobArchiveFolder}/${fileName}`;
                let runner = new dna_discord_framework_1.BashScriptRunner();
                yield runner.RunLocally(`tar -zcvf ${filePath} -C /OrcaJobs ${this.FileName}`);
                const fileStats = yield promises_1.default.stat(filePath);
                this.CreateCopyCommand(`${this.FileName}Full.tar.gz`);
                let sizeAndFormat = this.GetFileSize(fileStats);
                if (sizeAndFormat[0] > 80 && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.CopyCommand}`);
                else
                    this.AddFileToResponseMessage(filePath);
            }
            catch (e) {
            }
        });
    }
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
    downloadFile(fileUrl, outputPath) {
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
