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
class Archive extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "archive";
        /* <inheritdoc> */
        this.CommandDescription = "Lists the Job Archive stored on the Device";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            if (!dataManager.IsDiscorcaSetup()) {
                //this.InitializeUserResponse(interaction, "Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                return;
            }
            if (!fs_1.default.existsSync(dataManager.JOB_ARCHIVE_FOLDER)) {
                //this.InitializeUserResponse(interaction, "No Job Archive Folder Found on the Device");
                this.AddToMessage("No Job Archive Folder Found on the Device");
                return;
            }
            //this.InitializeUserResponse(interaction, "Here are the Job Archives Stored on the Device: \n");
            this.AddToMessage("Here are the Job Archives Stored on the Device: \n");
            yield fs_1.default.readdirSync(dataManager.JOB_ARCHIVE_FOLDER).forEach(job => {
                dataManager.JOB_ARCHIVE_MAP[job] = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${job}/${job}Full.tar.gz`;
                //this.AddToResponseMessage(job)
                this.AddToMessage(job);
            });
            //this.AddToResponseMessage("\nTo Download an Archive use the /download Command and supply it with the Archives Name")
            this.AddToMessage("\nTo Download an Archive use the /download Command and supply it with the Archives Name");
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
    }
}
module.exports = Archive;
