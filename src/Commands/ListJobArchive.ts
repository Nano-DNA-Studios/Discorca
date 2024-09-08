import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class ListJobArchive extends Command {
    /* <inheritdoc> */
    public CommandName = "listarchive";

    /* <inheritdoc> */
    public CommandDescription = "Lists all the Stored Job Archives stored on the Device and in the Bind Mount";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const botData = BotData.Instance(OrcaBotDataManager);
        let jobs: string[] = fs.readdirSync(botData.JOB_ARCHIVE_FOLDER);

        this.InitializeUserResponse(interaction, "Here are the Job Archives Stored on the Device: ");
        this.AddToResponseMessage(" ");

        await jobs.forEach(job => {
            botData.JOB_ARCHIVE_MAP[job] = `${botData.HOST_DEVICE_MOUNT_LOCATION}/${job}/${job}Full.tar.gz`
            this.AddToResponseMessage(job)
        });

        this.AddToResponseMessage(" ");
        this.AddToResponseMessage("To Download an Archive use the /download Command and supply it with the Archives Name")
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;
}

export = ListJobArchive;