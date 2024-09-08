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
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Adding a User");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const user = interaction.options.getString("user");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the User")
            return;
        }

        if (user) {
            dataManager.AddServerUser(interaction.user.username, user);
            this.AddToResponseMessage(`The Server User has been set to ${user}.`);
        } else
            this.AddToResponseMessage(`The User has not been set or is invalid.`);
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
        }
    ];
}

export = AddUser;