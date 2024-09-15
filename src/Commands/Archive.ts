import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Archive extends Command {
    /* <inheritdoc> */
    public CommandName = "archive";

    /* <inheritdoc> */
    public CommandDescription = "Lists the Job Archive stored on the Device";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!dataManager.IsDiscorcaSetup()) {
            //this.InitializeUserResponse(interaction, "Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!fs.existsSync(dataManager.JOB_ARCHIVE_FOLDER)) {
            //this.InitializeUserResponse(interaction, "No Job Archive Folder Found on the Device");
            this.AddToMessage("No Job Archive Folder Found on the Device");
            return;
        }

        //this.InitializeUserResponse(interaction, "Here are the Job Archives Stored on the Device: \n");
        this.AddToMessage("Here are the Job Archives Stored on the Device: \n");

        await fs.readdirSync(dataManager.JOB_ARCHIVE_FOLDER).forEach(job => {
            dataManager.JOB_ARCHIVE_MAP[job] = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${job}/${job}Full.tar.gz`
            //this.AddToResponseMessage(job)
            this.AddToMessage(job);
        });

        //this.AddToResponseMessage("\nTo Download an Archive use the /download Command and supply it with the Archives Name")
        this.AddToMessage("\nTo Download an Archive use the /download Command and supply it with the Archives Name")
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;
}

export = Archive;