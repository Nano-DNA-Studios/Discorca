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
class SetHostName extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "sethostname";
        /* <inheritdoc> */
        this.CommandDescription = "Sets the Host Name Variable for the Bot, (The Host Name of the Host Device)";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.InitializeUserResponse(interaction, "Setting Host Device Name");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const hostName = interaction.options.getString("hostname");
            if (!dataManager) {
                this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Host Name");
                return;
            }
            if (hostName) {
                dataManager.SetHostName(hostName);
                this.AddToResponseMessage(`Host Name has been set to ${hostName}`);
            }
            else
                this.AddToResponseMessage(`Host Name has not been set or is invalid.`);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.Options = [
            {
                name: "hostname",
                description: "The Server Host Name",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
        ];
    }
}
module.exports = SetHostName;
