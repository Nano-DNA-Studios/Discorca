import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Sets the Download Locations
 */
class SetDownloadLocation extends Command {
    /* <inheritdoc> */
    public CommandName = "setdownloadlocation";

    /* <inheritdoc> */
    public CommandDescription = "Adds a Custom Download Location that is mapped to a Disord User";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting Download Location");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const downloadLocation = interaction.options.getString("downloadlocation");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Download Location")
            return;
        }

        if (downloadLocation) {
            dataManager.AddDownloadLocation(interaction.user.username, downloadLocation);
            this.AddToResponseMessage(`The Download Location has been set to ${downloadLocation}`);
        } else
            this.AddToResponseMessage(`The Download Location has not been set or is invalid.`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        {
            name: "downloadlocation",
            description: "The Download Location on the Users Personal Device",
            required: true,
            type: OptionTypesEnum.String
        },
    ];
}

export = SetDownloadLocation;