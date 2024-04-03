import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Sets the Max Zip Size
 */
class SetMaxZipSize extends Command {
    /* <inheritdoc> */
    public CommandName = "setmaxzipsize";

    /* <inheritdoc> */
    public CommandDescription = "Sets the Maximum Size a Zip File in Mega Bytes before Discorca returns an SCP Copy Command";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting Max Size");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const maxsize = interaction.options.getNumber("maxsize");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Download Location")
            return;
        }

        if (maxsize) {
            dataManager.SetMaxZipSize(maxsize);
            this.AddToResponseMessage(`The Max Size has been set to ${maxsize}`);
        } else
            this.AddToResponseMessage(`The Max Size has not been set or is invalid.`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        {
            name: "maxsize",
            description: "The Maximum Size of a Zip File in Mega Bytes",
            required: true,
            type: OptionTypesEnum.Number,
            choices: [
                {
                    name: "5",
                    value: 5
                },
                {
                    name: "10",
                    value: 10
                },
                {
                    name: "20",
                    value: 20
                },
                {
                    name: "30",
                    value: 30
                },
                {
                    name: "40",
                    value: 40
                },
                {
                    name: "50",
                    value: 50
                },
                {
                    name: "60",
                    value: 60
                },
                {
                    name: "70",
                    value: 70
                },
                {
                    name: "80",
                    value: 80
                },
            ]
        },
    ];
}

export = SetMaxZipSize;