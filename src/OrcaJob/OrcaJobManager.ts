import { BotData, Job, JobManager} from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

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
}

export default OrcaJobManager;