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
 * Command that Adds a User and a Custom Download Location on their Device
 */
class RegisterSync extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "registersync";
        /* <inheritdoc> */
        this.CommandDescription = "Registers a new User for Syncing";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const user = interaction.options.getString("user");
            const downloadLocation = interaction.options.getString("downloadlocation");
            if (!dataManager.IsDiscorcaSetup()) {
                this.InitializeUserResponse(interaction, "Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                return;
            }
            if (!(user && downloadLocation)) {
                this.InitializeUserResponse(interaction, "The Add User Command requires all the Options to be set.");
                return;
            }
            dataManager.AddServerUser(interaction.user.username, user);
            dataManager.AddDownloadLocation(interaction.user.username, downloadLocation);
            this.InitializeUserResponse(interaction, `New User has been registered for Syncing.`);
            this.AddToResponseMessage(`User : ${interaction.user.username} --> Server User : ${user}`);
            this.AddToResponseMessage(`Download Location : ${downloadLocation}`);
        });
        /* <inheritdoc> */
        this.Options = [
            {
                name: "user",
                description: "The Users Account on the Server",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: "downloadlocation",
                description: "The Download Location on the Users Personal Device",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            }
        ];
    }
}
module.exports = RegisterSync;
