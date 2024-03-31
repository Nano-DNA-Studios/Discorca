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
class AddUser extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "adduser";
        /* <inheritdoc> */
        this.CommandDescription = "Adds a User to the Server, Maps the Discord Username, Server User and Custom Download Location.";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.InitializeUserResponse(interaction, "Setting Host Device Mount Location");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const user = interaction.options.getString("user");
            const downloadLocation = interaction.options.getString("downloadlocation");
            if (!dataManager) {
                this.AddToResponseMessage("Data Manager doesn't Exist, can't set the User and Download Location");
                return;
            }
            if (user && downloadLocation) {
                dataManager.AddServerUser(interaction.user.username, user);
                dataManager.AddDownloadLocation(interaction.user.username, downloadLocation);
                this.AddToResponseMessage(`The Server User has been set to ${user} and the Download Location has been set to ${downloadLocation}`);
            }
            else
                this.AddToResponseMessage(`The User or Download Location has not been set or is invalid.`);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
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
            },
        ];
    }
}
module.exports = AddUser;
