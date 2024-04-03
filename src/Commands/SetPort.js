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
 * Command that Sets the Port Number for the SCP Copy Command
 */
class SetPort extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "setport";
        /* <inheritdoc> */
        this.CommandDescription = "Adds a Port Number needed to Connect to in order to copy files. (Set to 0 for no port)";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.InitializeUserResponse(interaction, "Setting Port");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const port = interaction.options.getNumber("port");
            if (!dataManager) {
                this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Download Location");
                return;
            }
            if (port) {
                dataManager.SetPort(port);
                this.AddToResponseMessage(`The Port has been set to ${port}`);
            }
            else
                this.AddToResponseMessage(`The Port has not been set or is invalid.`);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.Options = [
            {
                name: "port",
                description: "The Port Number of the Server or Device hosting Orca",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.Number
            },
        ];
    }
}
module.exports = SetPort;
