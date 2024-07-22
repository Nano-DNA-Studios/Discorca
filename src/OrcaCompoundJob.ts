import OrcaJob from "./OrcaJob";

class OrcaCompoundJob extends OrcaJob {

    public XYZFiles: string[];

    constructor(jobName: string, xyzFiles: string[]) {
        super(jobName);

        this.JobName = jobName.split(".")[0];
        this.InputFileName = `${this.JobName}.cmp`;

        // this.OutputFileName = `${this.JobName}.out`;
        // this.XYZFileName = `${this.JobName}.xyz`;
        // this.TrjXYZFileName = `${this.JobName}_trj.xyz`;
        // this.ArchiveFile = `${this.JobName}Full.tar.gz`;
        // this.JobDirectory = dataManager.JOB_FOLDER;
        // this.JobArchiveDirectory = dataManager.JOB_ARCHIVE_FOLDER;
        // this.OrcaJobDirectory = `${this.JobDirectory}/${this.JobName}`;
        // this.OrcaJobArchiveDirectory = `${this.JobArchiveDirectory}/${this.JobName}`;
        // this.HostArchiveDirectory = dataManager.HOST_DEVICE_MOUNT_LOCATION;
        // this.StartTime = Date.now();

        this.XYZFiles = xyzFiles;
    }





}

export default OrcaCompoundJob;