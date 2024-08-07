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
const OrcaJob_1 = __importDefault(require("../OrcaJob"));
/**
 * Command that
 */
class SyncArchive extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "syncarchive";
        /* <inheritdoc> */
        this.CommandDescription = "Syncs the Local Device with the Archive. It Downloads the entire Archive Folder.";
        /**
        * The Username of the User who called the Command
        */
        this.DiscordUser = "";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.DiscordUser = interaction.user.username;
            this.InitializeUserResponse(interaction, "Use the following Command to Sync Archive to Local Device.");
            this.AddToResponseMessage("```" + this.GetSyncCommand() + "```");
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
    }
    /**
     * Gets the Full Sync Command Needed to paste in the Terminal to Sync the Archive
     * @returns The Full Sync Command to paste in Terminal
     */
    GetSyncCommand() {
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        const orcaJob = new OrcaJob_1.default("random");
        let command = "";
        try {
            const user = dataManager.DISCORD_USER_TO_SERVER_USER[this.DiscordUser];
            const downloadLocation = dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION[this.DiscordUser];
            const hostName = dataManager.HOSTNAME;
            if (dataManager.PORT == 0)
                command = `scp -r ${user}@${hostName}:${orcaJob.HostArchiveDirectory} "${downloadLocation}"`;
            else
                command = `scp -r -P ${dataManager.PORT} ${user}@${hostName}:${orcaJob.HostArchiveDirectory} "${downloadLocation}"`;
        }
        catch (e) {
            command = `scp -r serverUser@hostName:${orcaJob.HostArchiveDirectory} /Path/on/local/device`;
        }
        return command;
    }
}
module.exports = SyncArchive;
