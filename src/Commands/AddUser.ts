import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Adds a User and a Custom Download Location on their Device
 */
class AddUser extends Command {
    /* <inheritdoc> */
    public CommandName = "adduser";

    /* <inheritdoc> */
    public CommandDescription = "Adds a User to the Server, Maps the Discord Username, Server User and Custom Download Location.";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting Host Device Mount Location");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const user = interaction.options.getString("user");
        const downloadLocation = interaction.options.getString("downloadlocation");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the User and Download Location")
            return;
        }

        if (user && downloadLocation) {
            dataManager.AddServerUser(interaction.user.username, user);
            dataManager.AddDownloadLocation(interaction.user.username, downloadLocation);
            this.AddToResponseMessage(`The Server User has been set to ${user} and the Download Location has been set to ${downloadLocation}`);
        } else
            this.AddToResponseMessage(`The User or Download Location has not been set or is invalid.`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        {
            name: "user",
            description: "The Users Account on the Server",
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: "downloadlocation",
            description: "The Download Location on the Users Personal Device",
            required: true,
            type: OptionTypesEnum.String
        },
    ];
}

export = AddUser;