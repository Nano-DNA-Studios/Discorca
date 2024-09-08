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
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const fs_1 = __importDefault(require("fs"));
/**
 * Command that Purges all Job Folders in the Job Directory
 */
class ListJobArchive extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "listarchive";
        /* <inheritdoc> */
        this.CommandDescription = "Lists all the Stored Job Archives stored on the Device and in the Bind Mount";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const botData = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let jobs = fs_1.default.readdirSync(botData.JOB_ARCHIVE_FOLDER);
            this.InitializeUserResponse(interaction, "Here are the Job Archives Stored on the Device: ");
            this.AddToResponseMessage(" ");
            yield jobs.forEach(job => {
                botData.JOB_ARCHIVE_MAP[job] = `${botData.HOST_DEVICE_MOUNT_LOCATION}/${job}/${job}Full.tar.gz`;
                this.AddToResponseMessage(job);
            });
            this.AddToResponseMessage(" ");
            this.AddToResponseMessage("To Download an Archive use the /download Command and supply it with the Archives Name");
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
    }
}
module.exports = ListJobArchive;
