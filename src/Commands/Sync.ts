import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

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

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        this.AddToMessage("Use the following Command to Sync Archive to Local Device.");
        this.AddToMessage("```" + this.GetSyncCommand() + "```")
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /**
     * Gets the Full Sync Command Needed to paste in the Terminal to Sync the Archive
     * @returns The Full Sync Command to paste in Terminal
     */
    GetSyncCommand() {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let command = "";
        try {
            const user = dataManager.DISCORD_USER_TO_SERVER_USER[this.DiscordUser];
            const downloadLocation = dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION[this.DiscordUser];
            const hostName = dataManager.HOSTNAME;

            if (dataManager.PORT == 0)
                command = `scp -r ${user}@${hostName}:${dataManager.GetHostDeviceArchivePath()} "${downloadLocation}"`;
            else
                command = `scp -r -P ${dataManager.PORT} ${user}@${hostName}:${dataManager.GetHostDeviceArchivePath()} "${downloadLocation}"`;

        } catch (e) {
            command = `scp -r serverUser@hostName:${dataManager.GetHostDeviceArchivePath()} /Path/on/local/device`;
        }

        return command;
    }
}

export = Sync;