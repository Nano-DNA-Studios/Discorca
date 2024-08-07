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
/**
 * Command that Purges all Archive Folders in the Archive Directory
 */
class PurgeArchive extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "purgearchives";
        /* <inheritdoc> */
        this.CommandDescription = "Purges all Archives from the Server, clears the Archive Folder";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            let dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            this.InitializeUserResponse(interaction, "Purging Archive from the Server");
            yield runner.RunLocally("rm -rf /OrcaJobsArchive/*").catch(e => {
                e.name += `: Purge Archive`;
                dataManager.AddErrorLog(e);
            });
            this.AddToResponseMessage(":white_check_mark: Server has Purged all Archives :white_check_mark:");
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = false;
    }
}
module.exports = PurgeArchive;
