import { BashScriptRunner, BotData, Job, JobManager, SSHManager, SyncInfo, BotCommunication } from "dna-discord-framework";
import PythonJobManager from "./PythonJobManager";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";

class PythonJob extends Job {

    public JobManager: JobManager = new PythonJobManager();

    public PythonPackage: string;

    public InstallFile = "Install.txt";

    public StartFile = "Start.py";

    public PipPackages: string[] = [];

    public PythonLogs = "";

    public PythonDetailedLogs = "";

    constructor(jobName: string, commandUser: string) {
        super(jobName.split(".")[0], commandUser);

        this.PythonPackage = jobName;
        this.PythonLogs = `${this.JobName}Logs.txt`;
        this.PythonDetailedLogs = `${this.JobName}DetailedLogs.txt`;
    }

    public IsValidPythonJob(): boolean {
        if (!(this.PythonPackage.endsWith(".tar.gz") || this.PythonPackage.endsWith(".py")))
            return false;

        return fs.existsSync(`${this.JobDirectory}/${this.PythonPackage}`);
    }

    public IsPythonPackage(): boolean {
        if (this.PythonPackage.endsWith(".tar.gz"))
            return true;
        else
            return false;
    }

    /**
   * Creates the SCP Copy Command for the User to Copy and use in their Terminal
   * @param file The Name of the File to Copy
   * @returns The SCP Copy Command to Download the File
   */
    GetArchiveCopyCommand(): string {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const syncInfo: SyncInfo = dataManager.GetSCPInfo(this.JobAuthor);
        return SSHManager.GetSCPCommand(syncInfo, `${this.ArchiveDirectory}/${this.ArchiveFile}`, syncInfo.DownloadLocation);
    }

    public JobResourceUsage(): Record<string, number> {
        let record = { "Cores": 1 };

        return record;
    }

    public PythonDefaultFilesExist(): boolean {
        return (fs.existsSync(`${this.JobDirectory}/${this.InstallFile}`) && fs.existsSync(`${this.JobDirectory}/${this.StartFile}`))
    }

    public async SetupPythonEnvironment(message: BotCommunication): Promise<boolean> {

        if (this.IsPythonPackage())
        {
            await this.ExtractPackage();

            if (!this.PythonDefaultFilesExist()) {
                message.AddMessage(`Package provided is not a Valid Python Job. Package must contain a Install.txt file and a Start.py Python file`);
                return false;
            }
        }
        else 
        {
            this.StartFile = this.PythonPackage;

            if (!this.PythonDefaultFilesExist()) {
                message.AddMessage(`Package provided is not a Valid Python Job. A Install.txt file and a Python File must be provided.`);
                return false;
            }
        }
    
        if (!(await this.InstallPackages())) {
            message.AddMessage(`Python Package Install Failed :warning:`);
            message.AddMessage(`Aborting Python Calculation :no_entry:`);
            message.AddFile(`${this.JobDirectory}/${this.PythonDetailedLogs}`);
            return false;
        }

        message.AddMessage(`Python Environment Setup Complete`);

        return true;
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

    public async InstallPackages(): Promise<boolean> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let runner = new BashScriptRunner();
        let file = fs.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
        this.PipPackages = file.split("\n").filter((line) => line.length > 0);
        let installResults = true;

        for (const pipPackage of this.PipPackages) {
            if (!installResults)
                break;

            await runner.RunLocally(`pip install ${pipPackage} --force`, true, this.JobDirectory).catch(e => {
                e.name += `: Install Package (${pipPackage})`;
                e.message += `\n\nDetails:\n${runner.StandardErrorLogs}\n`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                installResults = false;

                const errorMessage = `Error occurred: \n${e.name}\n\nMessage: \n${e.message}\n`;
                fs.appendFileSync(`${this.JobDirectory}/${this.PythonLogs}`, errorMessage);
            });

            fs.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Pip Install ${pipPackage} Standard Logs: ${runner.StandardOutputLogs}\n`);
            fs.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Pip Install ${pipPackage} Standard Error Logs: ${runner.StandardErrorLogs}\n`);
        }

        return installResults;
    }

    public async UninstallPackages(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let runner = new BashScriptRunner();

        for (const pipPackage of this.PipPackages) {
            await runner.RunLocally(`pip uninstall -y ${pipPackage}`, true, this.JobDirectory).catch(e => {
                e.name += `: Uninstall Package (${pipPackage})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                return false;
            });
        }
    }

    public async RunJob(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let runner = new BashScriptRunner();

        await runner.RunLocally(`python3 ${this.StartFile} > ${this.JobDirectory}/${this.PythonLogs}`, true, this.JobDirectory).catch(e => {
            console.log(e);
            e.name += `: Run Job (${this.JobName})`;
            e.message += `\n\nDetails:${runner.StandardErrorLogs}\n`;
            dataManager.AddErrorLog(e);
            this.JobSuccess = false;
            this.JobFinished = true;
            const errorMessage = `Error occurred:\n ${e.name}\n\nMessage: ${e.message}\n`;
            fs.appendFileSync(`${this.JobDirectory}/${this.PythonLogs}`, errorMessage);
            return;
        });

        fs.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Python Standard Logs: ${runner.StandardOutputLogs}\n`);
        fs.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Python Standard Error Logs: ${runner.StandardErrorLogs}\n`);

        this.JobFinished = true;
    }

    public async SendPythonLogs(message: BotCommunication): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        const syncInfo: SyncInfo = dataManager.GetSCPInfo(this.JobAuthor);

        await this.SendFile(message, `${this.JobDirectory}/${this.PythonLogs}`, `Python Logs are too large, it can be downloaded using the command: ${SSHManager.GetSCPCommand(syncInfo, `${this.JobManager.HostJobDirectory}/${this.PythonLogs}`, syncInfo.DownloadLocation)}`);
        await this.SendArchive(message, `Archive file is too large, it can be downloaded using the command ${this.JobManager.GetHostArchiveCopyCommand(syncInfo, this.JobName, syncInfo.DownloadLocation)}`);
    }
}

export default PythonJob;