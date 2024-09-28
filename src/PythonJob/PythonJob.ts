import { Job, JobManager } from "dna-discord-framework";
import PythonJobManager from "./PythonJobManager";

class PythonJob extends Job{

    public JobManager: JobManager = new PythonJobManager();

    public JobResourceUsage(): Record<string, number> {
        throw new Error("Method not implemented.");
    }
    public RunJob(): Promise<void> {
        throw new Error("Method not implemented.");
    }
    
}

export default PythonJob;