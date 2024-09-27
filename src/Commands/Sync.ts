import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import OrcaJobManager from "../OrcaJobManager";
import SyncInfo from "../SyncInfo";

/**
 * Command that 
 */
class Sync extends Command {
    /* <inheritdoc> */
    public CommandName = "sync";

    /* <inheritdoc> */
    public CommandDescription = "Syncs your Personal Device with the Archive on the Server";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /**
    * The Username of the User who called the Command
    */
    DiscordUser: string = "";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        this.DiscordUser = interaction.user.username;

        const JobManager = new OrcaJobManager(); 

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        const syncInfo: SyncInfo = dataManager.GetSCPInfo(this.DiscordUser);

        this.AddToMessage("Use the following Command to Sync Archive to Local Device.");
        this.AddToMessage(JobManager.GetArchiveSyncCommand(syncInfo, syncInfo.DownloadLocation))
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;
}

export = Sync;