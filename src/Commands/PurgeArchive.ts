import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Purges all Archive Folders in the Archive Directory
 */
class PurgeArchive extends Command {
    /* <inheritdoc> */
    public CommandName = "purgearchives";

    /* <inheritdoc> */
    public CommandDescription = "Purges all Archives from the Server, clears the Archive Folder";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(OrcaBotDataManager);
        let runner = new BashScriptRunner();

        this.InitializeUserResponse(interaction, "Purging Archive from the Server");

        await runner.RunLocally("rm -rf /OrcaJobsArchive/*").catch(e => {
            e.name += `: Purge Archive`;
            dataManager.AddErrorLog(e);});

        this.AddToResponseMessage(":white_check_mark: Server has Purged all Archives :white_check_mark:");
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = false;
}

export = PurgeArchive;