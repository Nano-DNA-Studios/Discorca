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
const BashScriptsEnum_1 = __importDefault(require("../BashScriptsEnum"));
const BashCommandHandler_1 = __importDefault(require("../BashCommandHandler"));
const BashScript_1 = __importDefault(require("../BashScript"));
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
//import got from 'got';
//Start works
class Orca extends BashScript_1.default {
    constructor() {
        super(...arguments);
        this.CommandName = "orca";
        this.CommandDescription = "Pings the Server to determine if it is Online";
        this.CustomCode = `
/Orca/orca /home/orca/input.inp > /home/orca/output.out
`;
        this.SubCommands = [BashScriptsEnum_1.default.Custom];
        this.CommandFunction = (interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const data = interaction.options.getAttachment("orcafile");
            const saveLocation = "/home/orca";
            if (data)
                yield downloadFile(data.url, path_1.default.join(saveLocation, "input.inp"));
        });
        this.ReplyMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
        this.LogMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
        this.ErrorMessage = ":warning: Server couldn't run the Orca Calculation :warning:";
        this.SuccessMessage = ":white_check_mark: Server has completed the Orca Calculation :white_check_mark:";
        this.FailMessages = ["Server Not Live"];
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypes.Attachment,
                name: "orcafile",
                description: "Orca File to Run through Orca",
                required: true,
            },
        ];
        this.MaxOutTimer = 0;
        this.CommandHandler = BashCommandHandler_1.default.Instance();
    }
}
function downloadFile(fileUrl, outputPath) {
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
module.exports = Orca;
