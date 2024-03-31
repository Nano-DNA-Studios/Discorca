import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotDataManager, Command } from "dna-discord-framework";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class PurgeJobs extends Command {
    /* <inheritdoc> */
    public CommandName = "purgejobs";

    /* <inheritdoc> */
    public CommandDescription = "Purges all Jobs from the Server, clears the Job Folder";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let runner = new BashScriptRunner();

        this.InitializeUserResponse(interaction, "Purging Jobs from the Server");

        await runner.RunLocally("rm -rf /OrcaJobs/*");

        this.AddToResponseMessage(":white_check_mark: Server has Purged all Jobs :white_check_mark:");
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = false;
}

export = PurgeJobs;