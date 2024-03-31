import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotDataManager, Command } from "dna-discord-framework";

/**
 * Command that Purges all Archive Folders in the Archive Directory
 */
class PurgeArchive extends Command {
    /* <inheritdoc> */
    public CommandName = "purgearchives";

    /* <inheritdoc> */
    public CommandDescription = "Purges all Archives from the Server, clears the Archive Folder";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let runner = new BashScriptRunner();

        this.InitializeUserResponse(interaction, "Purging Archive from the Server");

        await runner.RunLocally("rm -rf /OrcaJobsArchive/*");

        this.AddToResponseMessage(":white_check_mark: Server has Purged all Archives :white_check_mark:");
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = false;
}

export = PurgeArchive;