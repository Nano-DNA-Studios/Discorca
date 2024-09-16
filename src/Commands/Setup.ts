import { Client, ChatInputCommandInteraction, CacheType, ChannelType } from "discord.js";
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

       this.AddToMessage("Setting up Discorca");

       console.log("Setting up Discorca");

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const port = interaction.options.getNumber("port");
        const maxsize = interaction.options.getNumber("maxzipfilesize");
        const hostname = interaction.options.getString("hostname");
        const mountlocation = interaction.options.getString("mountlocation");
        const calculationchannel = interaction.options.getChannel("calculationchannel");

        console.log("Accessed Options");

        if (!dataManager) {
            this.AddToMessage("Data Manager doesn't Exist, can't set the Download Location");
            return;
        }

        if (!(hostname && mountlocation && maxsize && port && calculationchannel)) {
            this.AddToMessage("The Setup Command requires all the Options to be set.");
            return;
        }

        if (calculationchannel.type != ChannelType.GuildText) {
            this.AddToMessage("The Calculation Channel must be a Text Channel");
            return;
        }

        console.log("Options are Valid");

        try {
            dataManager.SetHostName(hostname);
            dataManager.SetMountLocation(mountlocation);
            dataManager.SetMaxZipSize(maxsize);
            dataManager.SetPort(port);
            dataManager.SetCalculationChannelID(calculationchannel.id);

            console.log("Options Set");

            dataManager.SaveData();

            console.log("Data Saved");
        } catch (error) {
            this.AddToMessage("Error Occured while setting up Discorca");
            return;
        }
        
        this.AddToMessage(`Discorca has been setup with the following settings:`);
        this.AddToMessage(`Host Name : ${hostname}`);
        this.AddToMessage(`Mount Location : ${mountlocation} MB`);
        this.AddToMessage(`Max Zip File Size : ${maxsize}`);
        this.AddToMessage(`Port : ${port}`);
        this.AddToMessage(`Calculation Channel : ${calculationchannel.name}`);

        dataManager.CreateJobDirectories();
        dataManager.DISCORCA_SETUP = dataManager.IsDiscorcaSetup();
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
        {
            name: "calculationchannel",
            description: "The Text Channel where the Calculations will be posted",
            required: true,
            type: OptionTypesEnum.Channel
        }
    ];
}

export = Setup;