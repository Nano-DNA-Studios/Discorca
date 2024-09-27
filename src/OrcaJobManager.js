"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const JobManager_1 = __importDefault(require("./Jobs/JobManager"));
const OrcaBotDataManager_1 = __importDefault(require("./OrcaBotDataManager"));
const Job_1 = __importDefault(require("./Jobs/Job"));
class OrcaJobManager extends JobManager_1.default {
    constructor() {
        super();
        this.JobGlobalDirectory = "/DiscorcaJobs";
        this.JobCategory = "Orca";
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        this.HostArchiveDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${Job_1.default.ArchiveSubdirectory}`;
        this.HostJobDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${Job_1.default.JobSubdirectory}`;
    }
}
exports.default = OrcaJobManager;
