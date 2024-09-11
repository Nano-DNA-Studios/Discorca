import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Sets the Port Number for the SCP Copy Command
 */
class Setup extends Command {
    /* <inheritdoc> */
    public CommandName = "setup";

    /* <inheritdoc> */
    public CommandDescription = "Configures Discorca with proper settings for calculations";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, "Setting up Discorca");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const port = interaction.options.getNumber("port");
        const maxsize = interaction.options.getNumber("maxzipfilesize");
        const hostname = interaction.options.getString("hostname");
        const mountlocation = interaction.options.getString("mountlocation");

        if (!dataManager) {
            this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Download Location")
            return;
        }

        if (!(hostname && mountlocation && maxsize && port)) {
            this.AddToResponseMessage("The Setup Command requires all the Options to be set.");
            return;
        }

        try {
            dataManager.SetHostName(hostname);
            dataManager.SetMountLocation(mountlocation);
            dataManager.SetMaxZipSize(maxsize);
            dataManager.SetPort(port);
    
            dataManager.SaveData();
        } catch (error) {
            this.AddToResponseMessage("Error Occured while setting up Discorca");
            return;
        }
        
        this.AddToResponseMessage(`Discorca has been setup with the following settings:`);
        this.AddToResponseMessage(`Host Name : ${hostname}`);
        this.AddToResponseMessage(`Mount Location : ${mountlocation} MB`);
        this.AddToResponseMessage(`Max Zip File Size : ${maxsize}`);
        this.AddToResponseMessage(`Port : ${port}`);

        dataManager.DISCORCA_SETUP = dataManager.DiscorcaSetup();
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    Options: ICommandOption[] = [
        
        {
            name: "hostname",
            description: "The HostName or IP Address of the Device hosting Discorca",
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: "mountlocation",
            description: "The Mount location storing the Job Files on the Host Device",
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: "maxzipfilesize",
            description: "The Maximum Size of the Zip File that can be uploaded through Discord",
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
        {
            name: "port",
            description: "The SSH Port Number of the Server or Device hosting Orca (0 if no Port)",
            required: true,
            type: OptionTypesEnum.Number
        },
    ];
}

export = Setup;