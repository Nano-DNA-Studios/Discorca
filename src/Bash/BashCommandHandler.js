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
Object.defineProperty(exports, "__esModule", { value: true });
const BashScriptRunner_1 = __importDefault(require("./BashScriptRunner"));
const BashScriptsEnum = require("./BashScriptsEnum");
const dna_discord_framework_1 = require("dna-discord-framework");
/**
 * Command Handler for Bash Commands
 */
class BashCommandHandler {
    HandleCommand(interaction, client, dataManager) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const Factory = new dna_discord_framework_1.CommandFactory(interaction.commandName);
                const Bash = Factory.CreateCommand();
                if (Bash) {
                    let bashInstances = this.GetBashInstances(Bash, dataManager);
                    yield dna_discord_framework_1.CommandLogger.InitializeResponse(interaction, client, dataManager);
                    for (const bashInstance of bashInstances) {
                        dna_discord_framework_1.CommandLogger.LogAndRespond(bashInstance.LogMessage);
                        yield bashInstance.CommandFunction(interaction, dataManager);
                        try {
                            let BashResult = yield new BashScriptRunner_1.default(bashInstance, dataManager).RunBashScript();
                            if (BashResult)
                                dna_discord_framework_1.CommandLogger.LogAndRespond(bashInstance.SuccessMessage);
                            else
                                dna_discord_framework_1.CommandLogger.LogAndRespond(bashInstance.ErrorMessage);
                        }
                        catch (error) {
                            dna_discord_framework_1.CommandLogger.LogAndRespond(bashInstance.ErrorMessage + `  (${error})`);
                        }
                        dataManager.AddCommandLog(dna_discord_framework_1.CommandLogger.GetCommandLog(interaction));
                    }
                }
            }
            catch (error) {
                console.log(`Error Occurred : ${error}`);
            }
        });
    }
    /**
     * Extracts all Sub Commands and returns each Bash Script Instance in the the Correct Instance
     * @param Bash The Bash Command being called
     * @param BotDataManager The Discord Bot Data Manager
     * @returns An Array of Bash Script Instances based off the Sub Command List
     */
    GetBashInstances(Bash, BotDataManager) {
        let bashInstances = [];
        Bash.SubCommands.forEach((subCommand) => {
            let commandName = '';
            if (subCommand === BashScriptsEnum.Custom)
                commandName = Bash.CommandName;
            else
                commandName = subCommand;
            const factory = new dna_discord_framework_1.CommandFactory(commandName);
            const bashInstance = factory.CreateCommand();
            if (bashInstance)
                bashInstances.push(bashInstance);
        });
        return bashInstances;
    }
    /**
     * Gets an Instance of the Bash Command Handler
     * @returns Returns an Instance of the Bash Command Handler
     */
    static Instance() {
        return new BashCommandHandler();
    }
}
exports.default = BashCommandHandler;
