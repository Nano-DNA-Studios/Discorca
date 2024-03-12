import IBashCommand from "./IBashCommand";
import { CacheType, ChatInputCommandInteraction, Client } from 'discord.js';
import { BotDataManager, ICommandOption, ICommandHandler, DefaultCommandHandler } from "dna-discord-framework";

/**
 * Class representing a Bash Script 
 */
class BashScript implements IBashCommand {
    public CommandName: string = '';
    public CommandDescription: string= '';
    public CustomCode: string = '';
    public CommandFunction: (interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => void = () => { };
    public SubCommands: string[] = [];
    public ReplyMessage: string =   '';
    public LogMessage: string = '';
    public ErrorMessage: string= '';
    public SuccessMessage: string = '';
    public FailMessages: string[] = [];
    public Options: ICommandOption[] = [];
    public MaxOutTimer: number = 0;
    public CommandHandler: ICommandHandler = DefaultCommandHandler.Instance();

    /**
     * Gets the Bash Script code to run
     * @returns The Bash Script that will run for the command
     */
    GetCode(): string {
        return this.CustomCode.replace('\t', '');
    }

    /**
     * Runs the Discord Bash Command
     * @param BotDataManager Instance of the BotDataManager
     * @param interaction Instance of the ChatInputCommandInteraction
     */
    RunCommand(dataManager: BotDataManager, interaction: ChatInputCommandInteraction<CacheType>): void {
        this.CommandFunction(interaction, dataManager);
    }

    /**
     * Determines if the Bash Script has a Max Out Timer
     * @returns True if the Bash Script has a Max Out Timer more than 0, False if it is less
     */
    public HasMaxOutTimer(): boolean {
        if (this.MaxOutTimer > 0)
            return true;
        else
            return false;
    }
}

export default BashScript;