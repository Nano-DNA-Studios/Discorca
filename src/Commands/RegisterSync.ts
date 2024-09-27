import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Adds a User and a Custom Download Location on their Device
 */
class RegisterSync extends Command {
    /* <inheritdoc> */
    public CommandName = "registersync";

    /* <inheritdoc> */
    public CommandDescription = "Registers a new User for Syncing";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const user = interaction.options.getString("user");
        const downloadLocation = interaction.options.getString("downloadlocation");

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!(user && downloadLocation)) {
            this.AddToMessage("The Add User Command requires all the Options to be set.");
            return;
        }

        dataManager.AddSCPUser(interaction.user.username, user, downloadLocation);

        this.AddToMessage(`New User has been registered for Syncing.`);
        this.AddToMessage(`User : ${interaction.user.username} --> Server User : ${user}`);
        this.AddToMessage(`Download Location : ${downloadLocation}`);
    };

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
        }
    ];
}

export = RegisterSync;