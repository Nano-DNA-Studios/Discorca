import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import PurgeType from "../PurgeType";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Purge extends Command {
    /* <inheritdoc> */
    public CommandName = "purge";

    /* <inheritdoc> */
    public CommandDescription = "Allows the User to Purge the Jobs Directory or Job Archive Directory";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(OrcaBotDataManager);
        let purgeType = interaction.options.getString("purgetype");

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!purgeType) {
            this.AddToMessage("Invalid Purge Type \nPlease provide a valid Purge Type");
            return;
        }

        if (purgeType === PurgeType.Jobs) {
            this.AddToMessage("Purging Jobs from the Server");
            dataManager.PurgeJobs();
            this.AddToMessage("Discorca Purged Jobs Folder");
        } else if (purgeType === PurgeType.Archive) {
            this.AddToMessage("Purging Job Archive from the Server");
            dataManager.PurgeArchive();
            this.AddToMessage("Discorca Purged Job Archive Folder");
        }
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    public Options?: ICommandOption[] = [
        {
            name: "purgetype",
            description: "The Type of Purge to Perform",
            required: true,
            type: OptionTypesEnum.String,
            choices: [
                {
                    name: "Jobs",
                    value: PurgeType.Jobs
                },
                {
                    name: "Job Archive",
                    value: PurgeType.Archive
                }
            ]
        }

    ];
}

export = Purge;