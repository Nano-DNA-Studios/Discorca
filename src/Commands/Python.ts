import { CacheType, ChatInputCommandInteraction, Client, User } from "discord.js";
import { Command, BotDataManager, BotData, OptionTypesEnum } from "dna-discord-framework";
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

    /**
     * User instance that called the Command
     */
    DiscordCommandUser: User | undefined;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const pythonpackage = interaction.options.getAttachment("pythonpackage");

        this.DiscordCommandUser = interaction.user;

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!pythonpackage) {
            this.AddToMessage("No Python Package was Provided. Please Provide a Python Package to Run");
            return;
        }

        

        

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