import { OptionTypesEnum, BotDataManager, Command, DefaultCommandHandler, BotData, BotResponse, BotMessage } from "dna-discord-framework"
import { ActivityType, CacheType, ChatInputCommandInteraction, Client, Message, TextChannel, User } from "discord.js";
import fsp from "fs/promises"
import OrcaBotDataManager from "../OrcaBotDataManager";
import OrcaJob from "../OrcaJob";
import OrcaJobFile from "../OrcaJobFile";

/**
 * Command that Runs an Orca Calculation on the Device the Bot is hosted by
 */
class Orca extends Command {

    /* <inheritdoc> */
    CommandName = "orca";

    /* <inheritdoc> */
    CommandDescription = "Runs an Orca Calculation on the Server";

    /* <inheritdoc> */
    IsEphemeralResponse = true;

    /* <inheritdoc> */
    CommandHandler = DefaultCommandHandler.Instance();

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "inputfile",
            description: "Orca File to Run through Orca",
            required: true,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile1",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile2",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile3",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile4",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
        {
            type: OptionTypesEnum.Attachment,
            name: "xyzfile5",
            description: "Additional XYZ File to Run through Orca",
            required: false,
        },
    ];

    /**
     * The Name of the Job that is currently running
     */
    JobName: string = "";

    /* <inheritdoc> */
    JobIsComplete = false;

    CalculationMessage : BotMessage | undefined;

    DiscordCommandUser: User | undefined;

    //OrcaJobMessage: Message<true> | undefined;

    /* <inheritdoc> */
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const inputfile = interaction.options.getAttachment("inputfile");
        const xyzfile1 = interaction.options.getAttachment("xyzfile1");
        const xyzfile2 = interaction.options.getAttachment("xyzfile2");
        const xyzfile3 = interaction.options.getAttachment("xyzfile3");
        const xyzfile4 = interaction.options.getAttachment("xyzfile4");
        const xyzfile5 = interaction.options.getAttachment("xyzfile5");

        let files = [inputfile, xyzfile1, xyzfile2, xyzfile3, xyzfile4, xyzfile5];

        this.DiscordCommandUser = interaction.user;
        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!dataManager.IsDiscorcaSetup()) {
            //this.InitializeUserResponse(interaction, "Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!inputfile) {
            //this.InitializeUserResponse(interaction, "Input file was not provided");
            this.AddToMessage("Input file was not provided");
            return;
        }

        //this.InitializeUserResponse(interaction, `Preparing Orca Calculation on ${inputfile.name}`);
        this.AddToMessage(`Preparing Orca Calculation on ${inputfile.name}`);

        let orcaJob = new OrcaJob(inputfile.name);

        try {
            await orcaJob.CreateDirectories();
            await orcaJob.DownloadFiles(files);

            //this.AddToResponseMessage(`Files Received`);
            this.AddToMessage(`Files Received`);

            dataManager.AddJob(orcaJob);

            //this.CalculationMessage.content = `Running Orca Calculation on ${inputfile.name}`;

            const textChannel: TextChannel = await client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID) as TextChannel;
            this.CalculationMessage = new BotMessage(textChannel);
            this.CalculationMessage.AddMessage(`Running Orca Calculation on ${inputfile.name}`);

            //this.OrcaJobMessage = await textChannel.send(this.CalculationMessage);
            //this.UpdateJobMessage();

            if (client.user)
                client.user.setActivity(`Orca Calculation ${orcaJob.JobName}`, { type: ActivityType.Playing });

            //this.AddToResponseMessage(`Server will start the Orca Calculation :hourglass_flowing_sand:`);
            this.AddToMessage(`Server will start the Orca Calculation :hourglass_flowing_sand:`);
            this.UpdateFile(orcaJob);

            await orcaJob.RunJob();

            this.CalculationMessage.content += `Server has completed the Orca Calculation (${this.GetJobTime(orcaJob)}):white_check_mark:`;
            //this.UpdateJobMessage();

            this.JobIsComplete = true;

            await this.SendFile(OrcaJobFile.OutputFile, orcaJob);
            await this.SendFile(OrcaJobFile.XYZFile, orcaJob);
            await this.SendFile(OrcaJobFile.TrajectoryXYZFile, orcaJob);
            await this.SendFullJobArchive(orcaJob);

            await dataManager.RemoveJob(orcaJob);

            this.QueueNextActivity(client, dataManager);

            this.PingUser(interaction, orcaJob.JobName, true);
        } catch (e) {
            try {
                if (orcaJob) {
                    this.CalculationMessage?.AddMessage("An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.");
                    //this.CalculationMessage.content += "An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.";
                    this.JobIsComplete = true;
                    dataManager.RemoveJob(orcaJob);
                    this.PingUser(interaction, orcaJob.JobName, false);
                }
                if (e instanceof Error)
                    dataManager.AddErrorLog(e);

                this.QueueNextActivity(client, dataManager);
            } catch (j) {
                if (j instanceof Error)
                    dataManager.AddErrorLog(j);
            }
        }
    };

    /**
     * Gets the Elapsed Time since the Job Started in String format
     * @param orcaJob The Orca Job Instance
     * @returns The Elapsed Time since the Job Started in String format
     */
    private GetJobTime(orcaJob: OrcaJob) {
        const now = Date.now();
        const elapsed = new Date(now - orcaJob.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();

        if (hours > 0)
            return `${hours} h:${minutes} m`;
        else
            return `${minutes} m`;
    }

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

    /**
     * Sends a Message and Pings the User who Called the Calculation, provides a Link to the Calculation
     * @param interaction The Message Interaction Created by the User
     */
    private PingUser(interaction: ChatInputCommandInteraction<CacheType>, jobName: string, success: boolean) {
        if (this.DiscordCommandUser == undefined || this.CalculationMessage == undefined || this.CalculationMessage.CommunicationInstance == undefined)
            return;
        
        if (!(this.CalculationMessage.CommunicationInstance instanceof Message))
            return;

        const link = `https://discord.com/channels/${this.CalculationMessage.CommunicationInstance.guildId}/${this.CalculationMessage.CommunicationInstance.channelId}/${this.CalculationMessage.CommunicationInstance.id}`; //Add this as link

        if (success)
            this.DiscordCommandUser.send(`${interaction.user} Server has completed the Orca Calculation ${jobName} :white_check_mark: \n It can be found here : ${link}`);
        else
            this.DiscordCommandUser.send(`${interaction.user} Server has encoutered a problem with the Orca Calculation ${jobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${link}`);
    }

    /**
     * Updates the 
     * @param orcaJob The Job that is currently running
     */
    async UpdateFile(orcaJob: OrcaJob) {
        while (!this.JobIsComplete) {
            await new Promise(resolve => setTimeout(resolve, 10000));

            if (this.DiscordCommandUser == undefined)
                return;

            try {

                if (this.CalculationMessage == undefined)
                    return;

                const filePath = orcaJob.GetFullFilePath(OrcaJobFile.OutputFile);
                const fileStats = await fsp.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);

                if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                    if (!this.CalculationMessage.content?.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordCommandUser.username)}`))
                        this.CalculationMessage.content += `\nThe Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordCommandUser.username)}`;
                }
                else {

                    this.CalculationMessage?.AddFile(filePath);

                    //if (!this.CalculationMessage.files?.some(file => file === filePath))
                    //    this.CalculationMessage.files?.push(filePath);
                }

            } catch (e) { console.log(e); }

            //this.UpdateJobMessage();
        }
    }

    /**
     * Adds the Specified file to the Bot Response for the User to Download. If the File is too Large it sends the SCP Command needed to Download
     * @param file The Name of the Job File
     * @param orcaJob The Orca Job Instance
     */
    async SendFile(file: OrcaJobFile, orcaJob: OrcaJob) {

        if (this.DiscordCommandUser == undefined)
            return;

        try {
            await orcaJob.CopyToArchive(file);

            if (this.CalculationMessage == undefined)
                return;

            const filePath = orcaJob.GetFullFilePath(file);
            const fileStats = await fsp.stat(filePath);
            const sizeAndFormat = orcaJob.GetFileSize(fileStats);

            if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                if (!this.CalculationMessage.content?.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordCommandUser.username)}`))
                    this.CalculationMessage.content += `\nThe Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordCommandUser.username)}`;
            }
            else {
                if (!this.CalculationMessage.files?.some(file => file === filePath))
                    this.CalculationMessage.files?.push(filePath);
            }

            
        } catch (e) { console.log(e); }

        //this.UpdateJobMessage();
    }

    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     * @param orcaJob The Orca Job Instance
     */
    async SendFullJobArchive(orcaJob: OrcaJob) {
        if (this.DiscordCommandUser == undefined)
            return;

        try {
            await orcaJob.ArchiveJob();

            if (this.CalculationMessage == undefined)
                return;

            const filePath = orcaJob.GetFullFilePath(OrcaJobFile.ArchiveFile);
            const fileStats = await fsp.stat(filePath);
            const sizeAndFormat = orcaJob.GetFileSize(fileStats);

            if (sizeAndFormat[0] > BotData.Instance(OrcaBotDataManager).ZIP_FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                if (!this.CalculationMessage.content?.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordCommandUser.username)}`))
                    this.CalculationMessage.content += `\nThe Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile.OutputFile, this.DiscordCommandUser.username)}`;
            }
            else {
                this.CalculationMessage.AddFile(filePath);
            }

        } catch (e) { console.log(e); }

        //this.UpdateJobMessage();
    }
}

export = Orca;