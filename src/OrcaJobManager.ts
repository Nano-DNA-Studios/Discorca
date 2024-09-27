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

    GetArchiveSyncCommand(syncInfo: SyncInfo, destinationPath: string): string {
        return this.GetSCPCommand(syncInfo, this.HostArchiveDirectory, destinationPath);
    }

    GetHostArchiveCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(syncInfo, path, destinationPath);
    }

    GetHostJobCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return this.GetSCPCommand(syncInfo, path, destinationPath);
    }

    public GetSCPCommand(scpInfo: SSHInfo, sourcePath : string, destinationPath: string, isDirectory: boolean = false): string {
        const user = scpInfo?.Username;
        const hostName = scpInfo?.HostName;
        const port = scpInfo?.Port;
        let command = "";
        let recursive = "";

        if (isDirectory)
        {
            sourcePath += "/";
            recursive = "-r ";
        }

        if (!(user && destinationPath && hostName)) {
            const command = `scp ${recursive}-P port serverUser@hostName:${sourcePath} /Path/on/local/device`;
            return "```" + command + "```"
        }

        if (port == 0)
            command = `scp ${recursive}${user}@${hostName}:${sourcePath} ${destinationPath}`;
        else
            command = `scp ${recursive}-P ${port} ${user}@${hostName}:${sourcePath} ${destinationPath}`;

        return "```" + command + "```";
    }
}

export default OrcaJobManager;