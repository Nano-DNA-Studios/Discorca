"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const JobManager_1 = __importDefault(require("./Jobs/JobManager"));
const OrcaBotDataManager_1 = __importDefault(require("./OrcaBotDataManager"));
const Job_1 = __importDefault(require("./Jobs/Job"));
const SSHManager_1 = __importDefault(require("./SSH/SSHManager"));
class OrcaJobManager extends JobManager_1.default {
    constructor() {
        super();
        this.JobGlobalDirectory = "/DiscorcaJobs";
        this.JobCategory = "Orca";
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        this.HostArchiveDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${Job_1.default.ArchiveSubdirectory}`;
        this.HostJobDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${Job_1.default.JobSubdirectory}`;
    }
    GetArchiveSyncCommand(syncInfo, destinationPath) {
        return SSHManager_1.default.GetSCPCommand(syncInfo, this.HostArchiveDirectory, destinationPath, true);
    }
    GetHostArchiveCopyCommand(syncInfo, jobName, destinationPath) {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return SSHManager_1.default.GetSCPCommand(syncInfo, path, destinationPath, true);
    }
    GetHostJobCopyCommand(syncInfo, jobName, destinationPath) {
        const path = this.HostJobDirectory + "/" + jobName;
        return SSHManager_1.default.GetSCPCommand(syncInfo, path, destinationPath, true);
    }
}
exports.default = OrcaJobManager;
