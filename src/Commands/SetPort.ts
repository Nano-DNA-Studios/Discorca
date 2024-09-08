import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Sets the Port Number for the SCP Copy Command
 */
class SetPort extends Command {
    /* <inheritdoc> */
    public CommandName = "setport";

    /* <inheritdoc> */
    public CommandDescription = "Adds a Port Number needed to Connect to in order to copy files. (Set to 0 for no port)";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting Port");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const port = interaction.options.getNumber("port");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Download Location")
            return;
        }

        if (port) {
            dataManager.SetPort(port);
            this.AddToResponseMessage(`The Port has been set to ${port}`);
        } else
            this.AddToResponseMessage(`The Port has not been set or is invalid.`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        {
            name: "port",
            description: "The Port Number of the Server or Device hosting Orca",
            required: true,
            type: OptionTypesEnum.Number
        },
    ];
}

export = SetPort;