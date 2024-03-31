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
const promises_1 = __importDefault(require("fs/promises"));
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const OrcaJob_1 = __importDefault(require("../OrcaJob"));
const OrcaJobFile_1 = __importDefault(require("../OrcaJobFile"));
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
        /* <inheritdoc> */
        this.CommandHandler = dna_discord_framework_1.DefaultCommandHandler.Instance();
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
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const data = interaction.options.getAttachment("orcafile");
            if (!data)
                return;
            this.DiscordUser = interaction.user.username;
            this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);
            let orcaJob = new OrcaJob_1.default(data.name);
            yield orcaJob.CreateDirectories();
            yield orcaJob.DownloadFile(data.url);
            yield orcaJob.RunJob();
            this.AddToResponseMessage(":white_check_mark: Server has completed the Orca Calculation :white_check_mark:");
            yield this.SendFile(OrcaJobFile_1.default.OutputFile, orcaJob);
            yield this.SendFile(OrcaJobFile_1.default.XYZFile, orcaJob);
            yield this.SendFile(OrcaJobFile_1.default.TrajectoryXYZFile, orcaJob);
            yield this.SendFullJobArchive(orcaJob);
        });
        /**
          * The Username of the User who called the Command
          */
        this.DiscordUser = "";
    }
    /**
     * Adds the Specified file to the Bot Response for the User to Download. If the File is too Large it sends the SCP Command needed to Download
     * @param file The Name of the Job File
     * @param orcaJob The Orca Job Instance
     */
    SendFile(file, orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield orcaJob.CopyToArchive(file);
                const filePath = orcaJob.GetFullFilePath(file);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(file, this.DiscordUser)}`);
                else
                    this.AddFileToResponseMessage(filePath);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     * @param orcaJob The Orca Job Instance
     */
    SendFullJobArchive(orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield orcaJob.ArchiveJob();
                const filePath = orcaJob.GetFullFilePath(OrcaJobFile_1.default.ArchiveFile);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).ZIP_FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.ArchiveFile, this.DiscordUser)}`);
                else
                    this.AddFileToResponseMessage(filePath);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
module.exports = Orca;
