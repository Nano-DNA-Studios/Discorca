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
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
//Start works
class Orca extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "orca";
        this.CommandDescription = "Runs an Orca Calculation on the Server";
        this.RunningMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
        this.LogMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
        this.ErrorMessage = ":warning: Server couldn't run the Orca Calculation :warning:";
        this.SuccessMessage = ":white_check_mark: Server has completed the Orca Calculation :white_check_mark:";
        this.IsEphemeralResponse = false;
        this.SaveLocation = "/OrcaJobs";
        this.InputFileName = "";
        this.OutputFileName = "";
        this.JobLocation = "";
        this.CustomCode = `/Orca/orca  ${this.JobLocation}/${this.InputFileName}  > ${this.JobLocation}/${this.OutputFileName}`;
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            const data = interaction.options.getAttachment("orcafile");
            if (!data)
                return;
            this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);
            const fileName = data.name.split(".")[0];
            this.InputFileName = `${fileName}.inp`;
            this.OutputFileName = `${fileName}.out`;
            this.JobLocation = path_1.default.join(this.SaveLocation, fileName);
            fs_1.default.mkdirSync(this.JobLocation, { recursive: true });
            yield this.downloadFile(data.url, path_1.default.join(this.JobLocation, this.InputFileName));
            let runner = new dna_discord_framework_1.BashScriptRunner();
            yield runner.RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);
            this.AddToResponseMessage(this.SuccessMessage);
            yield runner.RunLocally(`tar -zcvf /OrcaJobsArchive/${fileName}.tar.gz -C /OrcaJobs ${fileName}`);
            (_a = this.Response.files) === null || _a === void 0 ? void 0 : _a.push(`/OrcaJobsArchive/${fileName}.tar.gz`);
            this.AddToResponseMessage("Sending Compressed Job Archive");
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
