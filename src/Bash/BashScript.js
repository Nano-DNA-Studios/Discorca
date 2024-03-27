"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
/**
 * Class representing a Bash Script
 */
class BashScript {
    constructor() {
        this.CommandName = '';
        this.CommandDescription = '';
        this._CustomCode = '';
        this.CommandFunction = () => { };
        this.SubCommands = [];
        this.ReplyMessage = '';
        this.LogMessage = '';
        this.ErrorMessage = '';
        this.SuccessMessage = '';
        this.FailMessages = [];
        this.Options = [];
        this.MaxOutTimer = 0;
        this.CommandHandler = dna_discord_framework_1.DefaultCommandHandler.Instance();
    }
    get CustomCode() {
        return this._CustomCode;
    }
    set CustomCode(value) {
        this._CustomCode = value;
    }
    /**
     * Gets the Bash Script code to run
     * @returns The Bash Script that will run for the command
     */
    GetCode() {
        return this.CustomCode.replace('\t', '');
    }
    /**
     * Runs the Discord Bash Command
     * @param BotDataManager Instance of the BotDataManager
     * @param interaction Instance of the ChatInputCommandInteraction
     */
    RunCommand(dataManager, interaction) {
        this.CommandFunction(interaction, dataManager);
    }
    /**
     * Determines if the Bash Script has a Max Out Timer
     * @returns True if the Bash Script has a Max Out Timer more than 0, False if it is less
     */
    HasMaxOutTimer() {
        if (this.MaxOutTimer > 0)
            return true;
        else
            return false;
    }
}
exports.default = BashScript;
