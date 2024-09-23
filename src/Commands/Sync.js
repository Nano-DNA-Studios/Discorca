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
const OrcaJobManager_1 = __importDefault(require("../OrcaJobManager"));
/**
 * Command that
 */
class Sync extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "sync";
        /* <inheritdoc> */
        this.CommandDescription = "Syncs your Personal Device with the Archive on the Server";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /**
        * The Username of the User who called the Command
        */
        this.DiscordUser = "";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            this.DiscordUser = interaction.user.username;
            const JobManager = new OrcaJobManager_1.default();
            if (!dataManager.IsDiscorcaSetup()) {
                this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                return;
            }
            if (!Object.keys(dataManager.DISCORD_USER_SCP_INFO).includes(this.DiscordUser)) {
                this.AddToMessage("The SCP Information for the User has not been Setup. Run the /registersync Command to Configure SCP Information.");
                return;
            }
            this.AddToMessage("Use the following Command to Sync Archive to Local Device.");
            this.AddToMessage("```" + JobManager.GetArchiveSyncCommand(dataManager.DISCORD_USER_SCP_INFO[this.DiscordUser]) + "```");
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
    }
}
module.exports = Sync;
