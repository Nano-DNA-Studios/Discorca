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
        let channel = await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel;
        this.CalculationMessage = new BotMessage(channel);

        await pythonJob.Setup([pythonpackage])

        //await pythonJob.RemoveDirectories();
        //await pythonJob.CreateDirectories();
        //await pythonJob.DownloadFiles([pythonpackage]);

        this.AddToMessage(`Files Received`);

        if (!pythonJob.PythonPackageExists()) {
            this.AddToMessage(`File provided is not a valid Python Package. Please provide a valid Python Package to Run`);
            pythonJob.RemoveDirectories();
            return;
        }

        await pythonJob.ExtractPackage();

        if (!pythonJob.PythonDefaultFilesExist()) {
            this.AddToMessage(`Package provided is not a Valid Python Package. Please provide a valid Python Package to Run. It must container a Install.txt file and a Start.py file`);
            return;
        }

        this.CalculationMessage.AddMessage(`Running Python Calculation on ${pythonpackage.name} :snake:`);

        dataManager.AddJobArchive(pythonJob);
        dataManager.AddJob(pythonJob);

        if (client.user)
            client.user.setActivity(`Python Calculation ${pythonJob.JobName}`, { type: ActivityType.Playing });

        this.AddToMessage(`Discorca will start the Python Calculation :hourglass_flowing_sand:`);

        if (!(await pythonJob.InstallPackages())) {
            this.CalculationMessage.AddMessage(`Python Package Install Failed :warning:`);
            this.CalculationMessage.AddTextFile(pythonJob.PythonInstaller.StandardErrorLogs, "InstallErrorLog.txt");
            this.CalculationMessage.AddMessage(`Aborting Python Calculation :no_entry:`);
            return;
        }

        this.CalculationMessage.AddMessage(`Pip Packages Installed Successfully`);
        this.CalculationMessage.AddMessage(`Running Start.py :hourglass_flowing_sand:`);

        await pythonJob.RunJob();

        if (!pythonJob.JobSuccess) {
            this.CalculationMessage.AddMessage(`Python Calculation Failed :warning:`);
            return;
        } else
            this.CalculationMessage.AddMessage(`Python Calculation Completed Successfully (${pythonJob.JobElapsedTime()}) :white_check_mark:`);

        await pythonJob.ArchiveJob(dataManager);
        await pythonJob.SendPythonLogs(this.CalculationMessage);
        await pythonJob.UninstallPackages();

        dataManager.RemoveJob(pythonJob);
        dataManager.QueueNextActivity(client);
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