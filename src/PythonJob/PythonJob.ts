import { BashScriptRunner, BotData, Job, JobManager } from "dna-discord-framework";
import PythonJobManager from "./PythonJobManager";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";
import { BotCommunication } from "dna-discord-framework";

class PythonJob extends Job {

    public JobManager: JobManager = new PythonJobManager();

    public PythonPackage = "PythonPackage.tar.gz";

    public InstallFile = "Install.txt";

    public StartFile = "Start.py";

    constructor(jobName: string, commandUser: string) {
        super(jobName.split(".")[0], commandUser);

        this.PythonPackage = `${this.JobName}.tar.gz`;
    }

    public JobResourceUsage(): Record<string, number> {
        let record = { "Cores": 1 };

        return record;
    }

    public PythonPackageExists(): boolean {
        if (fs.existsSync(`${this.JobDirectory}/${this.PythonPackage}`))
            return true;
        else
            return false;
    }

    public PythonDefaultFilesExist(): boolean {
        if (fs.existsSync(`${this.JobDirectory}/${this.InstallFile}`) && fs.existsSync(`${this.JobDirectory}/${this.StartFile}`))
            return true;
        else
            return false;
    }

    public async ExtractPackage () : Promise<void> 
    {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        let runner = new BashScriptRunner();
        await runner.RunLocally(`tar -xzf ${this.PythonPackage}`, true, this.JobDirectory).catch(e => {
            console.log(e);
            e.name += `: Extract Job Package (${this.JobName})`;
            dataManager.AddErrorLog(e);
            this.JobSuccess = false;
        });

        await runner.RunLocally(`rm ${this.PythonPackage}`, true, this.JobDirectory).catch(e => {
            console.log(e);
            e.name += `: Remove Job Package (${this.JobName})`;
            dataManager.AddErrorLog(e);
            this.JobSuccess = false;
        });
    }

    public async InstallPackages (message: BotCommunication) : Promise<void>
    {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let file = fs.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
        let packages = file.split("\n").filter((line) => line.length > 0);

        await packages.forEach(async (pipPackage) => {
            let runner = new BashScriptRunner();
            await runner.RunLocally(`pip install ${pipPackage}`, true, this.JobDirectory).catch(e => {
                e.name += `: Install Package (${pipPackage})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                message.AddMessage(`Failed to Install Package : ${pipPackage}`);
                return;
            });
        });
    }

    public async RunJob(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        //This is how we generate packages
        //tar -zcvf name.tar.gz -C /home/mrdna/tests ./*
        //tar -xzf file.tar.gz (Extracts the tar file)
        let runner = new BashScriptRunner();

        await runner.RunLocally(`python3 ${this.StartFile}`, true, this.JobDirectory).catch(e => {
            console.log(e);
            e.name += `: Run Job (${this.JobName})`;
            dataManager.AddErrorLog(e);
            this.JobSuccess = false;
            return;
        });

        console.log(runner.StandardOutputLogs);

        this.JobFinished = true;
    }

}

export default PythonJob;