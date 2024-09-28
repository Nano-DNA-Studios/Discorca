import { BotData, Job, JobManager} from "dna-discord-framework";
import OrcaBotDataManager from "./OrcaBotDataManager";

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

    /*
    GetArchiveSyncCommand(syncInfo: SyncInfo, destinationPath: string): string {
        return SSHManager.GetSCPCommand(syncInfo, this.HostArchiveDirectory, destinationPath, true);
    }

    GetHostArchiveCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string {
        const path = this.HostArchiveDirectory + "/" + jobName;
        return SSHManager.GetSCPCommand(syncInfo, path, destinationPath, true);
    }

    GetHostJobCopyCommand(syncInfo: SyncInfo, jobName: string, destinationPath: string): string {
        const path = this.HostJobDirectory + "/" + jobName;
        return SSHManager.GetSCPCommand(syncInfo, path, destinationPath, true);
    }
        */
}

export default OrcaJobManager;