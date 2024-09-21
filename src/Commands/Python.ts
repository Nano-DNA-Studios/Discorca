import { CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import { Command, BotDataManager, BotData, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";


class Python extends Command {
    /* <inheritdoc> */
    public CommandName = "status";

    /* <inheritdoc> */
    public CommandDescription = "Displays Discorca's Status and Resource Usage";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        

    };

    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "pythonpackage",
            description: "The Python Job Package to run",
            required: true,
        }
    ];
}

export = Python;