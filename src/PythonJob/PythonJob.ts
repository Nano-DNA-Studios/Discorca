import { BashScriptRunner, BotData, Job, JobManager, SSHManager, SyncInfo } from "dna-discord-framework";
import PythonJobManager from "./PythonJobManager";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";
import { BotCommunication } from "dna-discord-framework";

class PythonJob extends Job {

    public JobManager: JobManager = new PythonJobManager();

    public PythonPackage;

    public InstallFile = "Install.txt";

    public StartFile = "Start.py";

    public PythonJobRunner: BashScriptRunner;

    public PythonInstaller: BashScriptRunner;

    public PipPackages: string[] = [];

    public PythonLogs = "";

    constructor(jobName: string, commandUser: string) {
        super(jobName.split(".")[0], commandUser);

        this.PythonPackage = `${this.JobName}.tar.gz`;
        this.PythonLogs = `${this.JobName}Logs.txt`;
        this.PythonJobRunner = new BashScriptRunner();
        this.PythonInstaller = new BashScriptRunner();
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

    public async InstallPackages(): Promise<boolean> {
        const dataManager = BotData.Instance(OrcaBotDataManager);
        let file = fs.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
        this.PipPackages = file.split("\n").filter((line) => line.length > 0);

        for (const pipPackage of this.PipPackages) {
            await this.PythonInstaller.RunLocally(`pip install ${pipPackage}`, true, this.JobDirectory).catch(e => {
                e.name += `: Install Package (${pipPackage})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                return false;
            });
        }

        return true;
    }

    public async UninstallPackages(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        for (const pipPackage of this.PipPackages) {
            await this.PythonInstaller.RunLocally(`pip uninstall -y ${pipPackage}`, true, this.JobDirectory).catch(e => {
                e.name += `: Uninstall Package (${pipPackage})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                return false;
            });
        }
    }

    public async RunJob(): Promise<void> {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        //This is how we generate packagess
        //tar -zcvf name.tar.gz -C /home/mrdna/tests ./*
        //tar -xzf file.tar.gz (Extracts the tar file)
        //let runner = new BashScriptRunner();

        await this.PythonJobRunner.RunLocally(`python3 ${this.StartFile} > ${this.JobDirectory}/${this.PythonLogs}`, true, this.JobDirectory).catch(e => {
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
        message.AddFile(this.PythonLogs);

        const dataManager = BotData.Instance(OrcaBotDataManager);
        const syncInfo: SyncInfo = dataManager.GetSCPInfo(this.JobAuthor);
        //return SSHManager.GetSCPCommand(syncInfo, `${this.ArchiveDirectory}/${this.ArchiveFile}`, syncInfo.DownloadLocation);
        this.SendFile(message, `${this.JobDirectory}/${this.PythonLogs}`, `Python Logs are too large, it can be downloaded using the command: ${SSHManager.GetSCPCommand(syncInfo, `${this.JobDirectory}/${this.PythonLogs}`, syncInfo.DownloadLocation)}`);
        this.SendArchive(message, `Archive file is too large, it can be downloaded using the command ${SSHManager.GetSCPCommand(syncInfo, `${this.ArchiveDirectory}/${this.ArchiveFile}`, syncInfo.DownloadLocation)}`);


        //message.AddTextFile(this.PythonJobRunner.StandardOutputLogs, this.PythonLogs);
    }
}

export default PythonJob;