import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import os from "os";
import OrcaJobDescription from "../OrcaJobDescription";

class Resources extends Command {

    /* <inheritdoc> */
    public CommandName = "resources";

    /* <inheritdoc> */
    public CommandDescription = "Displays the Resources That are Currently being used by other Jobs.";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const jobs = dataManager.RUNNING_JOBS;

        this.InitializeUserResponse(interaction, `Resources being used are: `);
        this.RespondCPUUsage(jobs);
        this.RespondMemoryUsage();
        this.RespondJobList(jobs);
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /**
     * The Number of Bytes in a KiloByte
     */
    private KiloByte: number = 1024;

    /**
     * Displays the List of Active Jobs
     * @param jobs The Jobs that are currently running
     */
    private RespondJobList(jobs: Record<string, OrcaJobDescription>): void {
        this.AddToResponseMessage(`\nCurrent Jobs Running are: `);
        for (let job in jobs) 
            this.AddToResponseMessage(`${jobs[job].JobName}`)
    }

    /**
     * Responds to the Resource Command Message with the CPU Usage (Number of Cores being used by Jobs)
     * @param jobs The Jobs that are currently running
     */
    private RespondCPUUsage(jobs: Record<string, OrcaJobDescription>): void {
        let cores: number = 0;

        for (let job in jobs)
            cores += jobs[job].OccupiedCores;

        this.AddToResponseMessage(`CPUs : ${cores} Cores`);
    }

    /**
     * Responds to the Resource Command Message with the Memory Usage
     */
    private RespondMemoryUsage(): void {
        const TotalMemory = this.GetTotalMemory();
        const MemoryUsage = this.GetMemoryUsage();
        const TotalMemoryStr = this.MemoryAmountString(TotalMemory);
        const MemoryUsageStr = this.MemoryAmountString(MemoryUsage);
        const MemoryUsagePercentage = ((MemoryUsage / TotalMemory) * 100).toFixed(2);

        this.AddToResponseMessage(`Memory Usage: ${MemoryUsagePercentage}%  (${MemoryUsageStr}/${TotalMemoryStr})`);
    }

    /**
     * Converts Bytes to the most Appropriate Unit
     * @param memory The Amount of Memory in Bytes
     * @returns The Memory Amount with the Correct Unit in String Format
     */
    private MemoryAmountString(memory: number): string {
        if (memory < this.KiloByte)
            return `${memory} Bytes`;
        else if (memory < this.KiloByte * this.KiloByte)
            return `${(memory / this.KiloByte).toFixed(2)} KB`;
        else if (memory < this.KiloByte * this.KiloByte * this.KiloByte)
            return `${(memory / (this.KiloByte * this.KiloByte)).toFixed(2)} MB`;
        else
            return `${(memory / (this.KiloByte * this.KiloByte * this.KiloByte)).toFixed(2)} GB`;
    }

    /**
     * Gets the Total Memory of the Device in Bytes
     * @returns The Total Memory of the Device in Bytes
     */
    private GetTotalMemory(): number {
        return os.totalmem();
    }

    /**
     * Gets the Memory Usage of the Device in Bytes
     * @returns The Memory Usage of the Device in Bytes
     */
    private GetMemoryUsage(): number {
        try {
            return this.GetTotalMemory() - os.freemem();
        } catch (error) {
            if (error instanceof Error)
                BotData.Instance(BotDataManager).AddErrorLog(error);

            return 0;
        }
    }
}

export = Resources;

