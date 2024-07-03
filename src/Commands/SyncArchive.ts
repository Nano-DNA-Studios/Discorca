import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import OrcaJob from "../OrcaJob";

/**
 * Command that 
 */
class SyncArchive extends Command {
    /* <inheritdoc> */
    public CommandName = "syncarchive";

    /* <inheritdoc> */
    public CommandDescription = "Syncs the Local Device with the Archive. It Downloads the entire Archive Folder.";

    /**
    * The Username of the User who called the Command
    */
    DiscordUser: string = "";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        this.DiscordUser = interaction.user.username;

        this.InitializeUserResponse(interaction, "Use the following Command to Sync Archive to Local Device.");
        this.AddToResponseMessage("```" + this.GetSyncCommand() + "```")
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /**
     * Gets the Full Sync Command Needed to paste in the Terminal to Sync the Archive
     * @returns The Full Sync Command to paste in Terminal
     */
    GetSyncCommand() {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const orcaJob: OrcaJob = new OrcaJob("random");
        let command = "";
        try {
            const user = dataManager.DISCORD_USER_TO_SERVER_USER[this.DiscordUser];
            const downloadLocation = dataManager.DISCORD_USER_TO_DOWNLOAD_LOCATION[this.DiscordUser];
            const hostName = dataManager.HOSTNAME;

            if (dataManager.PORT == 0)
                command = `scp -r ${user}@${hostName}:${orcaJob.HostArchiveDirectory} ${downloadLocation}`;
            else
                command = `scp -r -P ${dataManager.PORT} ${user}@${hostName}:${orcaJob.HostArchiveDirectory} "${downloadLocation}"`;

        } catch (e) {
            command = `scp -r serverUser@hostName:${orcaJob.HostArchiveDirectory} /Path/on/local/device`;
        }

        return command;
    }
}

export = SyncArchive;