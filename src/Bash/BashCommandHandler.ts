import BashScriptRunner from './BashScriptRunner';
import BotDataManager from '../PalworldBotDataManager';
import { CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import BashScriptsEnum = require('./BashScriptsEnum');
import BashScript from './BashScript';
import IBashCommand from './IBashCommand';
import { CommandLogger, ICommandHandler, CommandFactory } from 'dna-discord-framework';

/**
 * Command Handler for Bash Commands
 */
class BashCommandHandler implements ICommandHandler {

    public async HandleCommand(interaction: ChatInputCommandInteraction<CacheType>, client: Client, dataManager: BotDataManager): Promise<void> {
        try {
            const Factory = new CommandFactory(interaction.commandName);
            const Bash = Factory.CreateCommand<BashScript>();

            if (Bash) {
                let bashInstances = this.GetBashInstances(Bash, dataManager);

                await CommandLogger.InitializeResponse(interaction, client, dataManager);

                for (const bashInstance of bashInstances) {

                    CommandLogger.LogAndRespond(bashInstance.LogMessage);

                    await bashInstance.CommandFunction(interaction, dataManager);

                    try {

                        let BashResult = await new BashScriptRunner(bashInstance, dataManager).RunBashScript();

                        if (BashResult)
                        {
                            CommandLogger.LogAndRespond(bashInstance.SuccessMessage);
                            CommandLogger.Response.edit({ content: CommandLogger.ResponseMessage, files: ["/home/orca/output.out"]});
                         
                        }
                        else
                            CommandLogger.LogAndRespond(bashInstance.ErrorMessage);

                    } catch (error) {
                        CommandLogger.LogAndRespond(bashInstance.ErrorMessage + `  (${error})`);
                    }

                    dataManager.AddCommandLog(CommandLogger.GetCommandLog(interaction));
                }
            }
        } catch (error) {
            console.log(`Error Occurred : ${error}`);
        }
    }

    /**
     * Extracts all Sub Commands and returns each Bash Script Instance in the the Correct Instance
     * @param Bash The Bash Command being called
     * @param BotDataManager The Discord Bot Data Manager
     * @returns An Array of Bash Script Instances based off the Sub Command List
     */
    private GetBashInstances(Bash: IBashCommand, BotDataManager: BotDataManager): BashScript[] {
        let bashInstances: BashScript[] = [];

        Bash.SubCommands.forEach((subCommand) => {

            let commandName = '';
            if (subCommand === BashScriptsEnum.Custom)
                commandName = Bash.CommandName;
            else
                commandName = subCommand;

            const factory = new CommandFactory(commandName);
            const bashInstance = factory.CreateCommand<BashScript>();

            if (bashInstance)
                bashInstances.push(bashInstance);
        });

        return bashInstances;
    }

    /**
     * Gets an Instance of the Bash Command Handler
     * @returns Returns an Instance of the Bash Command Handler
     */
    public static Instance(): BashCommandHandler {
        return new BashCommandHandler();
    }
}

export default BashCommandHandler;