import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import os from "os";

class Status extends Command {

    //Maybe eventually return the status of the bot as well, and a copy of error logs?

    /* <inheritdoc> */
    public CommandName = "status";

    /* <inheritdoc> */
    public CommandDescription = "Displays Discorca's Status and Resource Usage";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

     /* <inheritdoc> */
     public IsEphemeralResponse = true;

     /**
      * The Number of Bytes in a KiloByte
      */
     private KiloByte: number = 1024;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        this.AddToMessage(`Discorca's Status and used Resources: `);
        this.RespondMemoryUsage();
        this.RespondCPUUsage(dataManager);
        this.RespondJobList(dataManager);
    };

    /**
     * Displays the List of Active Jobs
     * @param jobs The Jobs that are currently running
     */
    private RespondJobList(dataManager: OrcaBotDataManager): void {
        if (!dataManager.IsJobRunning()) {
            this.AddToMessage(`\nNo Jobs are running currently.`);
            return;
        }

        let jobs = dataManager.RUNNING_JOBS;
        this.AddToMessage(`\nCurrent Jobs Running are: `);

        for (let job in jobs) 
            this.AddToMessage(`${jobs[job].JobName} (${jobs[job].JobElapsedTime()})`);
    }

    /**
     * Responds to the Resource Command Message with the CPU Usage (Number of Cores being used by Jobs)
     * @param jobs The Jobs that are currently running
     */
    private RespondCPUUsage(dataManager: OrcaBotDataManager): void {
        if (!dataManager.IsJobRunning()) {
            this.AddToMessage(`No CPU's are being used currently.`);
            return;
        }
        
        let cores: number = 0;
        let jobs = dataManager.RUNNING_JOBS;

        for (let job in jobs)
            cores += jobs[job].JobResourceUsage()?.Cores;
            
        this.AddToMessage(`CPUs : ${cores} Cores`);
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

        this.AddToMessage(`Memory Usage: ${MemoryUsagePercentage}%  (${MemoryUsageStr}/${TotalMemoryStr})`);
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

export = Status;

