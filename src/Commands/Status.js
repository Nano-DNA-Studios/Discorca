"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const os_1 = __importDefault(require("os"));
class Status extends dna_discord_framework_1.Command {
    constructor() {
        //Maybe eventually return the status of the bot as well, and a copy of error logs?
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "status";
        /* <inheritdoc> */
        this.CommandDescription = "Displays Discorca's Status and Resource Usage";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const jobs = dataManager.RUNNING_JOBS;
            this.InitializeUserResponse(interaction, `Discorca's Status and used Resources: `);
            this.RespondCPUUsage(jobs);
            this.RespondMemoryUsage();
            this.RespondJobList(jobs);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /**
         * The Number of Bytes in a KiloByte
         */
        this.KiloByte = 1024;
    }
    /**
     * Displays the List of Active Jobs
     * @param jobs The Jobs that are currently running
     */
    RespondJobList(jobs) {
        this.AddToResponseMessage(`\nCurrent Jobs Running are: `);
        for (let job in jobs)
            this.AddToResponseMessage(`${jobs[job].JobName} (${jobs[job].GetElapsedTime()})`);
    }
    /**
     * Responds to the Resource Command Message with the CPU Usage (Number of Cores being used by Jobs)
     * @param jobs The Jobs that are currently running
     */
    RespondCPUUsage(jobs) {
        let cores = 0;
        for (let job in jobs)
            cores += jobs[job].OccupiedCores;
        this.AddToResponseMessage(`CPUs : ${cores} Cores`);
    }
    /**
     * Responds to the Resource Command Message with the Memory Usage
     */
    RespondMemoryUsage() {
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
    MemoryAmountString(memory) {
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
    GetTotalMemory() {
        return os_1.default.totalmem();
    }
    /**
     * Gets the Memory Usage of the Device in Bytes
     * @returns The Memory Usage of the Device in Bytes
     */
    GetMemoryUsage() {
        try {
            return this.GetTotalMemory() - os_1.default.freemem();
        }
        catch (error) {
            if (error instanceof Error)
                dna_discord_framework_1.BotData.Instance(dna_discord_framework_1.BotDataManager).AddErrorLog(error);
            return 0;
        }
    }
}
module.exports = Status;
