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
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.CommandHandler = dna_discord_framework_1.DefaultCommandHandler.Instance();
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
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
        this.CalculationMessage = new dna_discord_framework_1.BotResponse();
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const inputfile = interaction.options.getAttachment("inputfile");
            const xyzfile1 = interaction.options.getAttachment("xyzfile1");
            const xyzfile2 = interaction.options.getAttachment("xyzfile2");
            const xyzfile3 = interaction.options.getAttachment("xyzfile3");
            const xyzfile4 = interaction.options.getAttachment("xyzfile4");
            const xyzfile5 = interaction.options.getAttachment("xyzfile5");
            let files = [inputfile, xyzfile1, xyzfile2, xyzfile3, xyzfile4, xyzfile5];
            this.DiscordCommandUser = interaction.user;
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            if (!dataManager.IsDiscorcaSetup()) {
                this.InitializeUserResponse(interaction, "Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
                return;
            }
            if (!inputfile) {
                this.InitializeUserResponse(interaction, "Input file was not provided");
                return;
            }
            this.InitializeUserResponse(interaction, `Preparing Orca Calculation on ${inputfile.name}`);
            let orcaJob = new OrcaJob_1.default(inputfile.name);
            try {
                yield orcaJob.CreateDirectories();
                yield orcaJob.DownloadFiles(files);
                this.AddToResponseMessage(`Files Received`);
                dataManager.AddJob(orcaJob);
                this.CalculationMessage.content = `Running Orca Calculation on ${inputfile.name}`;
                const textChannel = yield client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID);
                this.OrcaJobMessage = yield textChannel.send(this.CalculationMessage);
                this.UpdateJobMessage();
                if (client.user)
                    client.user.setActivity(`Orca Calculation ${orcaJob.JobName}`, { type: discord_js_1.ActivityType.Playing });
                this.AddToResponseMessage(`Server will start the Orca Calculation :hourglass_flowing_sand:`);
                this.UpdateFile(orcaJob);
                yield orcaJob.RunJob();
                this.CalculationMessage.content += `\nServer has completed the Orca Calculation (${this.GetJobTime(orcaJob)}):white_check_mark:`;
                this.UpdateJobMessage();
                this.JobIsComplete = true;
                //this.AddToResponseMessage(`Server has completed the Orca Calculation (${this.GetJobTime(orcaJob)}):white_check_mark:`);
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
                        this.CalculationMessage.content += "An Error Occured. Terminating Orca Job.\nCheck the Output File for Errors.";
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
    }
    UpdateJobMessage() {
        if (this.OrcaJobMessage == undefined) {
            this.AddToResponseMessage("An Error Occured while trying to send the Orca Calculation Message");
            return;
        }
        this.OrcaJobMessage.edit(this.CalculationMessage);
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
        if (this.DiscordCommandUser == undefined || this.OrcaJobMessage == undefined)
            return;
        const link = `https://discord.com/channels/${this.OrcaJobMessage.guildId}/${this.OrcaJobMessage.channelId}/${this.OrcaJobMessage.id}`;
        if (success)
            this.DiscordCommandUser.send(`${interaction.user} Server has completed the Orca Calculation ${jobName} :white_check_mark: \n It can be found here : ${link}`);
        else
            this.DiscordCommandUser.send(`${interaction.user} Server has encoutered a problem with the Orca Calculation ${jobName} :warning:\nThe Job has been Terminated, check the Output File for Errors. \nIt can be found here : ${link}`);
    }
    /**
     * Updates the
     * @param orcaJob The Job that is currently running
     */
    UpdateFile(orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            while (!this.JobIsComplete) {
                yield new Promise(resolve => setTimeout(resolve, 10000));
                if (this.DiscordCommandUser == undefined)
                    return;
                try {
                    const filePath = orcaJob.GetFullFilePath(OrcaJobFile_1.default.OutputFile);
                    const fileStats = yield promises_1.default.stat(filePath);
                    const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                    if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                        if (!((_a = this.CalculationMessage.content) === null || _a === void 0 ? void 0 : _a.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordCommandUser.username)}`)))
                            this.CalculationMessage.content += `\nThe Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordCommandUser.username)}`;
                    }
                    else {
                        if (!((_b = this.CalculationMessage.files) === null || _b === void 0 ? void 0 : _b.some(file => file === filePath)))
                            (_c = this.CalculationMessage.files) === null || _c === void 0 ? void 0 : _c.push(filePath);
                    }
                }
                catch (e) {
                    console.log(e);
                }
                this.UpdateJobMessage();
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
            var _a, _b, _c;
            if (this.DiscordCommandUser == undefined)
                return;
            try {
                yield orcaJob.CopyToArchive(file);
                const filePath = orcaJob.GetFullFilePath(file);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                    if (!((_a = this.CalculationMessage.content) === null || _a === void 0 ? void 0 : _a.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordCommandUser.username)}`)))
                        this.CalculationMessage.content += `\nThe Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordCommandUser.username)}`;
                }
                else {
                    if (!((_b = this.CalculationMessage.files) === null || _b === void 0 ? void 0 : _b.some(file => file === filePath)))
                        (_c = this.CalculationMessage.files) === null || _c === void 0 ? void 0 : _c.push(filePath);
                }
            }
            catch (e) {
                console.log(e);
            }
            this.UpdateJobMessage();
        });
    }
    /**
     * Sends the Full Job Archive File or if too Large sends the SCp Copy Command to Download it
     * @param orcaJob The Orca Job Instance
     */
    SendFullJobArchive(orcaJob) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            if (this.DiscordCommandUser == undefined)
                return;
            try {
                yield orcaJob.ArchiveJob();
                const filePath = orcaJob.GetFullFilePath(OrcaJobFile_1.default.ArchiveFile);
                const fileStats = yield promises_1.default.stat(filePath);
                const sizeAndFormat = orcaJob.GetFileSize(fileStats);
                if (sizeAndFormat[0] > dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).ZIP_FILE_MAX_SIZE_MB && sizeAndFormat[1] == "MB") {
                    if (!((_a = this.CalculationMessage.content) === null || _a === void 0 ? void 0 : _a.includes(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordCommandUser.username)}`)))
                        this.CalculationMessage.content += `\nThe Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${orcaJob.GetCopyCommand(OrcaJobFile_1.default.OutputFile, this.DiscordCommandUser.username)}`;
                }
                else {
                    if (!((_b = this.CalculationMessage.files) === null || _b === void 0 ? void 0 : _b.some(file => file === filePath)))
                        (_c = this.CalculationMessage.files) === null || _c === void 0 ? void 0 : _c.push(filePath);
                }
            }
            catch (e) {
                console.log(e);
            }
            this.UpdateJobMessage();
        });
    }
}
module.exports = Orca;
