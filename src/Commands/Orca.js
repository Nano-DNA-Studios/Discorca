"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const discord_js_1 = require("discord.js");
const promises_1 = __importDefault(require("fs/promises"));
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const OrcaJob_1 = __importDefault(require("../OrcaJob"));
const OrcaJobFile_1 = __importDefault(require("../OrcaJobFile"));
/**
 * Command that Runs an Orca Calculation on the Device the Bot is hosted by
 */
class Orca extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "orca";
        /* <inheritdoc> */
        this.CommandDescription = "Runs an Orca Calculation on the Server";
        /* <inheritdoc> */
        this.IsEphemeralResponse = false;
        /* <inheritdoc> */
        this.CommandHandler = dna_discord_framework_1.DefaultCommandHandler.Instance();
        /* <inheritdoc> */
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "inputfile",
                description: "Orca File to Run through Orca",
                required: true,
            },
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "xyzfile1",
                description: "Additional XYZ File to Run through Orca",
                required: false,
            },
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "xyzfile2",
                description: "Additional XYZ File to Run through Orca",
                required: false,
            },
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "xyzfile3",
                description: "Additional XYZ File to Run through Orca",
                required: false,
            },
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "xyzfile4",
                description: "Additional XYZ File to Run through Orca",
                required: false,
            },
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "xyzfile5",
                description: "Additional XYZ File to Run through Orca",
                required: false,
            },
        ];
        /**
         * The Name of the Job that is currently running
         */
        this.JobName = "";
        /* <inheritdoc> */
        this.JobIsComplete = false;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const inputfile = interaction.options.getAttachment("inputfile");
            const xyzfile1 = interaction.options.getAttachment("xyzfile1");
            const xyzfile2 = interaction.options.getAttachment("xyzfile2");
            const xyzfile3 = interaction.options.getAttachment("xyzfile3");
            const xyzfile4 = interaction.options.getAttachment("xyzfile4");
            const xyzfile5 = interaction.options.getAttachment("xyzfile5");
            this.DiscordUser = interaction.user.username;
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            if (!inputfile) {
                this.InitializeUserResponse(interaction, "No Data Manager found, cannot run Command.");
                return;
            }
            this.InitializeUserResponse(interaction, `Running Orca Calculation on ${inputfile.name}`);
            let orcaJob = new OrcaJob_1.default(inputfile.name);
            try {
                yield orcaJob.CreateDirectories();
                yield orcaJob.DownloadFile(inputfile);
                yield orcaJob.DownloadFile(xyzfile1);
                yield orcaJob.DownloadFile(xyzfile2);
                yield orcaJob.DownloadFile(xyzfile3);
                yield orcaJob.DownloadFile(xyzfile4);
                yield orcaJob.DownloadFile(xyzfile5);
                this.AddToResponseMessage(`Server will provide updates for the output file every 10 seconds`);
                this.UpdateFile(orcaJob);
                dataManager.AddJob(orcaJob);
                if (client.user)
                    client.user.setActivity(`Orca Calculation ${orcaJob.JobName}`, { type: discord_js_1.ActivityType.Playing });
                yield orcaJob.RunJob();
                this.JobIsComplete = true;
                this.AddToResponseMessage(`Server has completed the Orca Calculation (${this.GetJobTime(orcaJob)}):white_check_mark:`);
                yield this.SendFile(OrcaJobFile_1.default.OutputFile, orcaJob);
                yield this.SendFile(OrcaJobFile_1.default.XYZFile, orcaJob);
                yield this.SendFile(OrcaJobFile_1.default.TrajectoryXYZFile, orcaJob);
                yield this.SendFullJobArchive(orcaJob);
                yield dataManager.RemoveJob(orcaJob);
                this.QueueNextActivity(client, dataManager);
                this.PingUser(interaction, orcaJob.JobName, true);
            }
            catch (e) {
                try {
                    if (orcaJob) {
                        this.AddToResponseMessage("An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.");
                        this.JobIsComplete = true;
                        dataManager.RemoveJob(orcaJob);
                        this.PingUser(interaction, orcaJob.JobName, false);
                    }
                    if (e instanceof Error)
                        dataManager.AddErrorLog(e);
                    this.QueueNextActivity(client, dataManager);
                }
                catch (j) {
                    if (j instanceof Error)
                        dataManager.AddErrorLog(j);
                }
            }
        });
        /**
          * The Username of the User who called the Command
          */
        this.DiscordUser = "";
    }
    /**
     * Gets the Elapsed Time since the Job Started in String format
     * @param orcaJob The Orca Job Instance
     * @returns The Elapsed Time since the Job Started in String format
     */
    GetJobTime(orcaJob) {
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
    QueueNextActivity(client, dataManager) {
        if (client.user) {
            if (Object.keys(dataManager.RUNNING_JOBS).length == 0)
                client.user.setActivity(" ", { type: discord_js_1.ActivityType.Custom, state: "Listening for New Orca Calculation" });
            else {
                let job = Object.values(dataManager.RUNNING_JOBS)[0];
                client.user.setActivity(`Orca Calculation ${job.JobName}`, { type: discord_js_1.ActivityType.Playing, });
            }
        }
    }
    /**
     * Sends a Message and Pings the User who Called the Calculation, provides a Link to the Calculation
     * @param interaction The Message Interaction Created by the User
     */
    PingUser(interaction, jobName, success) {
        var _a;
        const link = `https://discord.com/channels/${interaction.guildId}/${interaction.channelId}/${(_a = this.UserResponse) === null || _a === void 0 ? void 0 : _a.id}`;
        if (success)
            interaction.user.send(`${interaction.user} Server has completed the Orca Calculation ${jobName} :white_check_mark: \n It can be found here : ${link}`);
        else
            interaction.user.send(`${interaction.user} Server has encoutered a problem with the Orca Calculation ${jobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${link}`);
    }
    /**
     * Updates the
     * @param orcaJob The Job that is currently running
     */
    UpdateFile(orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            while (!this.JobIsComplete) {
                yield new Promise(resolve => setTimeout(resolve, 10000));
                try {
                    const filePath = orcaJob.GetFullFilePath(OrcaJobFile_1.default.OutputFile);
                    const fileStats = yield promises_1.default.stat(filePath);
                    const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                    if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                        this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordUser)}`);
                    else
                        this.AddFileToResponseMessage(filePath);
                }
                catch (e) {
                    console.log(e);
                }
            }
        });
    }
    /**
     * Adds the Specified file to the Bot Response for the User to Download. If the File is too Large it sends the SCP Command needed to Download
     * @param file The Name of the Job File
     * @param orcaJob The Orca Job Instance
     */
    SendFile(file, orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield orcaJob.CopyToArchive(file);
                const filePath = orcaJob.GetFullFilePath(file);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(file, this.DiscordUser)}`);
                else
                    this.AddFileToResponseMessage(filePath);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     * @param orcaJob The Orca Job Instance
     */
    SendFullJobArchive(orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield orcaJob.ArchiveJob();
                const filePath = orcaJob.GetFullFilePath(OrcaJobFile_1.default.ArchiveFile);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).ZIP_FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB")
                    this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.ArchiveFile, this.DiscordUser)}`);
                else
                    this.AddFileToResponseMessage(filePath);
            }
            catch (e) {
                console.log(e);
            }
        });
    }
}
module.exports = Orca;
