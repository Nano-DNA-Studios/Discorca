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
 * Command that Purges all Job Folders in the Job Directory
 */
class SetMountLocation extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "setmountlocation";
        /* <inheritdoc> */
        this.CommandDescription = "Sets the Mount Location Variable for the Bot, (where the Archive is Stored on the Host Device)";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.InitializeUserResponse(interaction, "Setting Host Device Mount Location");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const filePath = interaction.options.getString("filepath");
            if (!dataManager) {
                this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Mount Location");
                return;
            }
            if (filePath) {
                dataManager.SetMountLocation(filePath);
                this.AddToResponseMessage(`Host Device Mount has been set to ${filePath}.`);
            }
            else
                this.AddToResponseMessage(`Host Device Mount Location has not been set or is invalid.`);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.Options = [
            {
                name: "filepath",
                description: "The Path to the Archive on the Host Device",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            }
        ];
    }
}
module.exports = SetMountLocation;
