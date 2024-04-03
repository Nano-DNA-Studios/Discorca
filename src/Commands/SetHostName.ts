import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class SetHostName extends Command {
    /* <inheritdoc> */
    public CommandName = "sethostname";

    /* <inheritdoc> */
    public CommandDescription = "Sets the Host Name Variable for the Bot, (The Host Name of the Host Device)";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting Host Device Name");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const hostName = interaction.options.getString("hostname");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Host Name")
            return;
        }

        if (hostName) {
            dataManager.SetHostName(hostName)
            this.AddToResponseMessage(`Host Name has been set to ${hostName}`);
        } else
            this.AddToResponseMessage(`Host Name has not been set or is invalid.`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        {
            name: "hostname",
            description: "The Server Host Name",
            required: true,
            type: OptionTypesEnum.String
        },
    ];
}

export = SetHostName;