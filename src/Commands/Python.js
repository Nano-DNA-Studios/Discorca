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
            let pythonJob = new PythonJob_1.default(pythonpackage.name, this.DiscordCommandUser.username);
            this.CalculationMessage = new dna_discord_framework_1.BotMessage(yield client.channels.fetch(dataManager.CALCULATION_CHANNEL_ID));
            yield pythonJob.RemoveDirectories();
            yield pythonJob.CreateDirectories();
            yield pythonJob.DownloadFiles([pythonpackage]);
            this.AddToMessage(`Files Received`);
            if (!pythonJob.PythonPackageExists()) {
                this.AddToMessage(`File provided is not a valid Python Package. Please provide a valid Python Package to Run`);
                pythonJob.RemoveDirectories();
                return;
            }
            yield pythonJob.ExtractPackage();
            if (!pythonJob.PythonDefaultFilesExist()) {
                this.AddToMessage(`Package provided is not a Valid Python Package. Please provide a valid Python Package to Run. It must container a Install.txt file and a Start.py file`);
                pythonJob.RemoveDirectories();
                return;
            }
            dataManager.AddJobArchive(pythonJob);
            dataManager.AddJob(pythonJob);
            if (client.user)
                client.user.setActivity(`Python Calculation ${pythonJob.JobName}`, { type: discord_js_1.ActivityType.Playing });
            this.AddToMessage(`Discorca will start the Python Calculation :hourglass_flowing_sand:`);
            this.CalculationMessage.AddMessage(`Running Python Calculation on ${pythonpackage.name} :snake:`);
            yield pythonJob.InstallPackages(this.CalculationMessage);
            if (!pythonJob.JobSuccess) {
                this.AddToMessage(`Python Package Install Failed. Check the Logs for more Information`);
                pythonJob.RemoveDirectories();
                return;
            }
            else
                this.CalculationMessage.AddMessage(`Pip Packages Installed Successfully`);
            yield pythonJob.RunJob();
        });
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypesEnum.Attachment,
                name: "pythonpackage",
                description: "The Python Job Package to run",
                required: true,
            }
        ];
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
}
module.exports = Python;
