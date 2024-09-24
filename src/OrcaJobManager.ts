import { BotData } from "dna-discord-framework";
import JobManager from "./Jobs/JobManager";
import OrcaBotDataManager from "./OrcaBotDataManager";
import Job from "./Jobs/Job";
import SSHInfo from "./SSH/SSHInfo";
import SyncInfo from "./SyncInfo";

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

    GetArchiveSyncCommand(syncInfo: SyncInfo): string {
        return this.GetSCPCommand(syncInfo, this.HostArchiveDirectory, syncInfo.DownloadLocation);
    }

    GetHostArchiveCopyCommand(syncInfo: SyncInfo, jobName: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(syncInfo, path, syncInfo.DownloadLocation);
    }

    GetHostJobCopyCommand(syncInfo: SyncInfo, jobName: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(syncInfo, path, syncInfo.DownloadLocation);
    }

    public GetSCPCommand(scpInfo: SSHInfo, sourcePath : string, destinationPath: string): string {
        const user = scpInfo?.Username;
        //const downloadLocation = scpInfo?.DownloadLocation;
        const hostName = scpInfo?.HostName;
        const port = scpInfo?.Port;
        let command = "";

        if (!(user && destinationPath && hostName)) {
            const command = `scp -P port serverUser@hostName:${sourcePath} /Path/on/local/device`;
            return "```" + command + "```"
        }

        if (port == 0)
            command = `scp ${user}@${hostName}:${sourcePath} ${destinationPath}`;
        else
            command = `scp -P ${port} ${user}@${hostName}:${sourcePath} ${destinationPath}`;

        return "```" + command + "```";
    }
}

export default OrcaJobManager;