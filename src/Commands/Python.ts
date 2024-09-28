import { ActivityType, CacheType, ChatInputCommandInteraction, Client, TextChannel, User } from "discord.js";
import { Command, BotDataManager, BotData, OptionTypesEnum, BotMessage, BotCommunication, DefaultBotCommunication } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import PythonJob from "../PythonJob/PythonJob";

class Python extends Command {
    /* <inheritdoc> */
    public CommandName = "python";

    /* <inheritdoc> */
    public CommandDescription = "Runs a Python Calculation on the Server";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /**
         * The Message that will be sent to the Calculation Channel
         */
    CalculationMessage: BotCommunication = new DefaultBotCommunication();

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

        this.AddToMessage(`Starting Python Job: ${pythonpackage.name} :snake:`);

        let pythonJob = new PythonJob(pythonpackage.name, this.DiscordCommandUser.username);
        this.CalculationMessage = new BotMessage(await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel);

        await pythonJob.RemoveDirectories();
        await pythonJob.CreateDirectories();
        await pythonJob.DownloadFiles([pythonpackage]);

        this.AddToMessage(`Files Received`);

        if (!pythonJob.PythonPackageExists()) {
            this.AddToMessage(`File provided is not a valid Python Package. Please provide a valid Python Package to Run`);
            pythonJob.RemoveDirectories();
            return;
        }

        await pythonJob.ExtractPackage();

        if (!pythonJob.PythonDefaultFilesExist()) {
            this.AddToMessage(`Package provided is not a Valid Python Package. Please provide a valid Python Package to Run. It must container a Install.txt file and a Start.py file`);
            //pythonJob.RemoveDirectories();
            return;
        }

        this.CalculationMessage.AddMessage(`Running Python Calculation on ${pythonpackage.name} :snake:`);

        dataManager.AddJobArchive(pythonJob);
        dataManager.AddJob(pythonJob);

        if (client.user)
            client.user.setActivity(`Python Calculation ${pythonJob.JobName}`, { type: ActivityType.Playing });

        this.AddToMessage(`Discorca will start the Python Calculation :hourglass_flowing_sand:`);

        if (await pythonJob.InstallPackages(this.CalculationMessage)) {
            this.CalculationMessage.AddMessage(`Python Package Install Failed : \n ${pythonJob.PythonInstaller.StandardErrorLogs}`);
            this.CalculationMessage.AddTextFile(pythonJob.PythonInstaller.StandardErrorLogs, "InstallErrorLog.txt");
            return;
        } else
            this.CalculationMessage.AddMessage(`Pip Packages Installed Successfully`);

        pythonJob.UpdateOutputFile(this.CalculationMessage);

        await pythonJob.RunJob();
        //await pythonJob.UninstallPackages(this.CalculationMessage);

        if (!pythonJob.JobSuccess) {
            this.CalculationMessage.AddMessage(`Python Calculation Failed :warning:`);
            return;
        } else
            this.CalculationMessage.AddMessage(`Python Calculation Completed Successfully (${pythonJob.JobElapsedTime()}) :white_check_mark:`);

        await pythonJob.SendPythonLogs(this.CalculationMessage);

        this.QueueNextActivity(client, dataManager);

    };

    /**
     * Updates the Status of the Bot to the Next Job in the Queue
     * @param client Discord Bot Client Instance
     * @param dataManager The OrcaBotDataManager Instance
     */
    private QueueNextActivity(client: Client<boolean>, dataManager: OrcaBotDataManager): void {
        if (client.user) {
            if (Object.keys(dataManager.RUNNING_JOBS).length == 0)
                client.user.setActivity(" ", { type: ActivityType.Custom, state: "Listening for New Orca Calculation" });
            else {
                let job = Object.values(dataManager.RUNNING_JOBS)[0];
                client.user.setActivity(`Orca Calculation ${job.JobName}`, { type: ActivityType.Playing, });
            }
        }
    }

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