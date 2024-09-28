"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
class PythonJobManager extends dna_discord_framework_1.JobManager {
    constructor() {
        super();
        this.JobGlobalDirectory = "/DiscorcaJobs";
        this.JobCategory = "Python";
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        this.HostArchiveDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${dna_discord_framework_1.Job.ArchiveSubdirectory}`;
        this.HostJobDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${dna_discord_framework_1.Job.JobSubdirectory}`;
    }
}
exports.default = PythonJobManager;
