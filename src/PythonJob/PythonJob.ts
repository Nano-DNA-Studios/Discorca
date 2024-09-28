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

    public PythonJobRunner: BashScriptRunner;

    public PythonInstaller: BashScriptRunner;

    public PythonLogs = "";

    constructor(jobName: string, commandUser: string) {
        super(jobName.split(".")[0], commandUser);

        this.PythonPackage = `${this.JobName}.tar.gz`;
        this.PythonLogs = `${this.JobName}Logs`;
        this.PythonJobRunner = new BashScriptRunner();
        this.PythonInstaller = new BashScriptRunner();
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

    public async ExtractPackage(): Promise<void> {
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

    public async InstallPackages(message: BotCommunication): Promise<boolean> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let file = fs.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
        let packages = file.split("\n").filter((line) => line.length > 0);
        let errors: boolean = false;

        console.log(packages);

        // Use for...of to handle async properly
        for (const pipPackage of packages) {
            console.log(`Installing Package : ${pipPackage}`);
            await this.PythonInstaller.RunLocally(`pip install ${pipPackage}`, true, this.JobDirectory).catch(e => {
                e.name += `: Install Package (${pipPackage})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                errors = true;
                message.AddMessage(`Failed to Install Package : ${pipPackage}`);
            });
        }

        return errors;
    }

    public async UninstallPackages(message: BotCommunication): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let file = fs.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
        let packages = file.split("\n").filter((line) => line.length > 0);

        packages.forEach(async (pipPackage) => {
            let runner = new BashScriptRunner();
            await runner.RunLocally(`pip uninstall ${pipPackage}`, true, this.JobDirectory).catch(e => {
                e.name += `: Uninstall Package (${pipPackage})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                message.AddMessage(`Failed to Uninstall Package : ${pipPackage}`);
                return;
            });
        });
    }

    public async RunJob(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        //This is how we generate packagess
        //tar -zcvf name.tar.gz -C /home/mrdna/tests ./*
        //tar -xzf file.tar.gz (Extracts the tar file)
        //let runner = new BashScriptRunner();

        console.log(`Running Python Job : ${this.JobName}`);

        await this.PythonJobRunner.RunLocally(`python3 ${this.StartFile}`, true, this.JobDirectory).catch(e => {
            console.log(e);
            e.name += `: Run Job (${this.JobName})`;
            dataManager.AddErrorLog(e);
            this.JobSuccess = false;
            this.JobFinished = true;
            return;
        });

        this.JobFinished = true;
    }

    public SendPythonLogs(message: BotCommunication): void {
        message.AddTextFile(this.PythonJobRunner.StandardOutputLogs, this.PythonLogs);
    }

    /**
     * Starts a loop that Sends the latest version of the Output file and uploads it to Discord. 
     * @param message The Bot Communication Message the file will be uploaded to
     */
    public async UpdateOutputFile(message: BotCommunication): Promise<void> {
        let count = 0;
        while (!this.JobFinished) {
            await new Promise(resolve => {
                setTimeout(() => {
                    count += 1;
                    resolve(undefined); // Call the resolve function to resolve the promise
                }, 100);
            });

            if (count > 100) {
                count = 0;
                this.SendPythonLogs(message);
            }
        }

        this.SendPythonLogs(message);
    }



}

export default PythonJob;