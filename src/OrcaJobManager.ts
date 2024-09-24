import { BotData } from "dna-discord-framework";
import JobManager from "./Jobs/JobManager";
import OrcaBotDataManager from "./OrcaBotDataManager";
import Job from "./Jobs/Job";
import SCPInfo from "./SSH/SCPInfo";

class OrcaJobManager extends JobManager {

    public JobGlobalDirectory: string = "/DiscorcaJobs";

    public JobCategory: string = "Orca";

    public HostArchiveDirectory: string;

    public HostJobDirectory: string;

    constructor() {
        super();
        const dataManager = BotData.Instance(OrcaBotDataManager);
        this.HostArchiveDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${Job.ArchiveSubdirectory}`;
        this.HostJobDirectory = `${dataManager.HOST_DEVICE_MOUNT_LOCATION}/${this.JobCategory}/${Job.JobSubdirectory}`;
    }

    GetArchiveSyncCommand(scpInfo: SCPInfo): string {
        return this.GetSCPCommand(scpInfo, this.HostArchiveDirectory);
    }

    GetHostArchiveCopyCommand(scpInfo: SCPInfo, jobName: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(scpInfo, path);
    }

    GetHostJobCopyCommand(scpInfo: SCPInfo, jobName: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(scpInfo, path);
    }

    public GetSCPCommand(scpInfo: SCPInfo, path: string): string {
        const user = scpInfo?.Username;
        const downloadLocation = scpInfo?.DownloadLocation;
        const hostName = scpInfo?.HostName;
        const port = scpInfo?.Port;
        let command = "";

        if (!(user && downloadLocation && hostName)) {
            const command = `scp -P port serverUser@hostName:${path} /Path/on/local/device`;
            return "```" + command + "```"
        }

        if (port == 0)
            command = `scp ${user}@${hostName}:${path} ${downloadLocation}`;
        else
            command = `scp -P ${port} ${user}@${hostName}:${path} ${downloadLocation}`;

        return "```" + command + "```";
    }
}

export default OrcaJobManager;