import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Purges all Job Folders in the Job Directory
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
        const hostName = interaction.options.getString("hostname");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Mount Location and Host Name")
            return;
        }

        if (filePath && hostName) {
            dataManager.SetMountLocation(filePath);
            dataManager.SetHostName(hostName)
            this.AddToResponseMessage(`Host Device Mount has been set to ${filePath} and Host Name has been set to ${hostName}`);
        } else
            this.AddToResponseMessage(`Host Device Mount Location or Host Name has not been set or is invalid.`);
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
        },
        {
            name: "hostname",
            description: "The Server Host Name",
            required: true,
            type: OptionTypesEnum.String
        },
    ];
}

export = SetMountLocation;