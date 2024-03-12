import { ICommand } from "dna-discord-framework";

/**
 * Describes the structure of a bash command
 */
interface IBashCommand extends ICommand
{
    /**
     * The bash code to be executed
     */
    CustomCode: string;

    /**
     * The subcommands of the bash command
     */
    SubCommands: string[];

    /**
     * The Maximum amount of Time the command can run for in Milliseconds
     */
    MaxOutTimer: number;
}

export default IBashCommand;