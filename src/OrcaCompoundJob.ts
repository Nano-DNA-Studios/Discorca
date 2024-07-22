import OrcaJob from "./OrcaJob";

class OrcaCompoundJob extends OrcaJob {

    public XYZFiles: string[] = [];

    constructor(jobName: string, xyzFiles: string[]) {
        super(jobName);

        this.JobName = jobName.split(".")[0];
        this.InputFileName = `${this.JobName}.cmp`;
        this.XYZFiles = xyzFiles;
    }
}

export default OrcaCompoundJob;