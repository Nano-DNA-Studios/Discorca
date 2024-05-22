import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

class Resources extends Command {
    /* <inheritdoc> */
    public CommandName = "resources";

    /* <inheritdoc> */
    public CommandDescription = "Displays the Resources That are Currently being used by other Jobs.";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const jobs = dataManager.RUNNING_JOBS;

        let cores: number = 0;

        for (let job in jobs) {
            cores += jobs[job].OccupiedCores;
        }

        this.InitializeUserResponse(interaction, `The Current Resources being used are: ${cores} Cores`);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;


}

export = Resources;

