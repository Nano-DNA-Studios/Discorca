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
    GetArchiveSyncCommand(scpInfo) {
        return this.GetSCPCommand(scpInfo, this.HostArchiveDirectory);
    }
    GetHostArchiveCopyCommand(scpInfo, jobName) {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(scpInfo, path);
    }
    GetHostJobCopyCommand(scpInfo, jobName) {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(scpInfo, path);
    }
    GetSCPCommand(scpInfo, path) {
        const user = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.Username;
        const downloadLocation = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.DownloadLocation;
        const hostName = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.HostName;
        const port = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.Port;
        let command = "";
        if (!(user && downloadLocation && hostName)) {
            const command = `scp -P port serverUser@hostName:${path} /Path/on/local/device`;
            return "```" + command + "```";
        }
        if (port == 0)
            command = `scp ${user}@${hostName}:${path} ${downloadLocation}`;
        else
            command = `scp -P ${port} ${user}@${hostName}:${path} ${downloadLocation}`;
        return "```" + command + "```";
    }
}
exports.default = OrcaJobManager;
