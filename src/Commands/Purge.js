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
const PurgeType_1 = __importDefault(require("../PurgeType"));
/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Purge extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "purge";
        /* <inheritdoc> */
        this.CommandDescription = "Allows the User to Purge the Jobs Directory or Job Archive Directory";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            let dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let purgeType = interaction.options.getString("purgetype");
            if (!dataManager.IsDiscorcaSetup()) {
                this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                return;
            }
            if (!purgeType) {
                this.AddToMessage("Invalid Purge Type \nPlease provide a valid Purge Type");
                return;
            }
            if (purgeType === PurgeType_1.default.Jobs) {
                this.AddToMessage("Purging Jobs from the Server");
                dataManager.PurgeJobs();
                this.AddToMessage("Discorca Purged Jobs Folder");
            }
            else if (purgeType === PurgeType_1.default.Archive) {
                this.AddToMessage("Purging Job Archive from the Server");
                dataManager.PurgeArchive();
                this.AddToMessage("Discorca Purged Job Archive Folder");
            }
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: "purgetype",
                description: "The Type of Purge to Perform",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String,
                choices: [
                    {
                        name: "Jobs",
                        value: PurgeType_1.default.Jobs
                    },
                    {
                        name: "Job Archive",
                        value: PurgeType_1.default.Archive
                    }
                ]
            }
        ];
    }
}
module.exports = Purge;
