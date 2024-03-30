import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotDataManager, Command } from "dna-discord-framework";

class PurgeJobs extends Command {
    public CommandName = "purgejobs";
    public CommandDescription = "Purges all Jobs from the Server, clears the Job Folder";
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let runner = new BashScriptRunner();

        this.InitializeUserResponse(interaction, "Purging Jobs from the Server");

        await runner.RunLocally("rm -rf /OrcaJobs/*");

        this.AddToResponseMessage(":white_check_mark: Server has purged all Jobs :white_check_mark:");
    };
    public IsEphemeralResponse = true;

}

export = PurgeJobs;