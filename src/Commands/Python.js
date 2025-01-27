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
const discord_js_1 = require("discord.js");
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const PythonJob_1 = __importDefault(require("../PythonJob/PythonJob"));
class Python extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "python";
        /* <inheritdoc> */
        this.CommandDescription = "Runs a Python Calculation on the Server";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /**
         * The Message that will be sent to the Calculation Channel
         */
        this.CalculationMessage = new dna_discord_framework_1.DefaultBotCommunication();
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const pythonpackage = interaction.options.getAttachment("pythonpackage");
            const channel = yield client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID);
            this.CalculationMessage = new dna_discord_framework_1.BotMessage(channel);
            this.DiscordCommandUser = interaction.user;
            let author = this.DiscordCommandUser.displayName;
            if (interaction.member && interaction.member instanceof discord_js_1.GuildMember) {
                author = interaction.member.nickname;
            }
            if (!dataManager.IsDiscorcaSetup())
                return this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            if (!pythonpackage)
                return this.AddToMessage("No Python Package was Provided. Please Provide a Python Package to Run");
            let pythonJob = new PythonJob_1.default(pythonpackage.name, this.DiscordCommandUser.displayName);
            this.AddToMessage(`Starting Python Job Setup: ${pythonpackage.name} :snake:`);
            yield pythonJob.Setup([pythonpackage]);
            this.AddToMessage(`Files Received`);
            if (!pythonJob.PythonPackageExists())
                return this.AddToMessage(`File provided is not a valid Python Package. Please provide a valid Python Package to Run`);
            this.AddToMessage(`Discorca will start the Python Calculation :hourglass_flowing_sand:`);
            this.CalculationMessage.AddMessage(`Running Python Calculation ${pythonJob.JobName} - ${pythonJob.JobAuthor} (${author}) :snake:`);
            if (!(yield pythonJob.SetupPythonEnvironment(this.CalculationMessage)))
                return yield this.SendResults(pythonJob, dataManager, this.DiscordCommandUser);
            if (client.user)
                client.user.setActivity(`Python Calculation ${pythonJob.JobName}`, { type: discord_js_1.ActivityType.Playing });
            dataManager.AddJobArchive(pythonJob);
            dataManager.AddJob(pythonJob);
            this.CalculationMessage.AddMessage(`Running Start.py :hourglass_flowing_sand:`);
            yield pythonJob.RunJob();
            if (!pythonJob.JobSuccess) {
                this.CalculationMessage.AddMessage(`Python Calculation Failed :warning:`);
                this.AddFileToMessage(`${pythonJob.JobDirectory}/${pythonJob.PythonDetailedLogs}`);
            }
            else
                this.CalculationMessage.AddMessage(`Python Calculation Completed Successfully (${pythonJob.JobElapsedTime()}) :white_check_mark:`);
            yield this.SendResults(pythonJob, dataManager, this.DiscordCommandUser);
            dataManager.RemoveJob(pythonJob);
            dataManager.QueueNextActivity(client);
        });
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "pythonpackage",
                description: "The Python Package containing essential files and the code to run",
                required: true,
            }
        ];
    }
    SendResults(pythonJob, dataManager, user) {
        return __awaiter(this, void 0, void 0, function* () {
            yield pythonJob.ArchiveJob(dataManager);
            yield pythonJob.SendPythonLogs(this.CalculationMessage);
            yield pythonJob.PingUser(this.CalculationMessage, user);
        });
    }
}
module.exports = Python;
