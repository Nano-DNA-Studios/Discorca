import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that sets the Docker Mount Location
 */
class SetMountLocation extends Command {
    /* <inheritdoc> */
    public CommandName = "setmountlocation";

    /* <inheritdoc> */
    public CommandDescription = "Sets the Mount Location Variable for the Bot, (where the Archive is Stored on the Host Device)";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting Host Device Mount Location");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const filePath = interaction.options.getString("filepath");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Mount Location")
            return;
        }

        if (filePath) {
            dataManager.SetMountLocation(filePath);
            this.AddToResponseMessage(`Host Device Mount has been set to ${filePath}.`);
        } else
            this.AddToResponseMessage(`Host Device Mount Location has not been set or is invalid.`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        {
            name: "filepath",
            description: "The Path to the Archive on the Host Device",
            required: true,
            type: OptionTypesEnum.String
        }
    ];
}

export = SetMountLocation;