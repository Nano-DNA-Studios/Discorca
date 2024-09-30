"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PythonJobManager_1 = __importDefault(require("./PythonJobManager"));
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
const fs_1 = __importDefault(require("fs"));
class PythonJob extends dna_discord_framework_1.Job {
    constructor(jobName, commandUser) {
        super(jobName.split(".")[0], commandUser);
        this.JobManager = new PythonJobManager_1.default();
        this.InstallFile = "Install.txt";
        this.StartFile = "Start.py";
        this.PipPackages = [];
        this.PythonLogs = "";
        this.PythonPackage = `${this.JobName}.tar.gz`;
        this.PythonLogs = `${this.JobName}Logs.txt`;
        this.PythonJobRunner = new dna_discord_framework_1.BashScriptRunner();
        this.PythonInstaller = new dna_discord_framework_1.BashScriptRunner();
    }
    /**
   * Creates the SCP Copy Command for the User to Copy and use in their Terminal
   * @param file The Name of the File to Copy
   * @returns The SCP Copy Command to Download the File
   */
    GetArchiveCopyCommand() {
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        const syncInfo = dataManager.GetSCPInfo(this.JobAuthor);
        return dna_discord_framework_1.SSHManager.GetSCPCommand(syncInfo, `${this.ArchiveDirectory}/${this.ArchiveFile}`, syncInfo.DownloadLocation);
    }
    JobResourceUsage() {
        let record = { "Cores": 1 };
        return record;
    }
    PythonPackageExists() {
        if (fs_1.default.existsSync(`${this.JobDirectory}/${this.PythonPackage}`))
            return true;
        else
            return false;
    }
    PythonDefaultFilesExist() {
        if (fs_1.default.existsSync(`${this.JobDirectory}/${this.InstallFile}`) && fs_1.default.existsSync(`${this.JobDirectory}/${this.StartFile}`))
            return true;
        else
            return false;
    }
    ExtractPackage() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            yield runner.RunLocally(`tar -xzf ${this.PythonPackage}`, true, this.JobDirectory).catch(e => {
                console.log(e);
                e.name += `: Extract Job Package (${this.JobName})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
            });
            yield runner.RunLocally(`rm ${this.PythonPackage}`, true, this.JobDirectory).catch(e => {
                console.log(e);
                e.name += `: Remove Job Package (${this.JobName})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
            });
        });
    }
    InstallPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let file = fs_1.default.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
            this.PipPackages = file.split("\n").filter((line) => line.length > 0);
            for (const pipPackage of this.PipPackages) {
                yield this.PythonInstaller.RunLocally(`pip install ${pipPackage}`, true, this.JobDirectory).catch(e => {
                    e.name += `: Install Package (${pipPackage})`;
                    dataManager.AddErrorLog(e);
                    this.JobSuccess = false;
                    return false;
                });
            }
            return true;
        });
    }
    UninstallPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            for (const pipPackage of this.PipPackages) {
                yield this.PythonInstaller.RunLocally(`pip uninstall -y ${pipPackage}`, true, this.JobDirectory).catch(e => {
                    e.name += `: Uninstall Package (${pipPackage})`;
                    dataManager.AddErrorLog(e);
                    this.JobSuccess = false;
                    return false;
                });
            }
        });
    }
    RunJob() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            //This is how we generate packagess
            //tar -zcvf name.tar.gz -C /home/mrdna/tests ./*
            //tar -xzf file.tar.gz (Extracts the tar file)
            //let runner = new BashScriptRunner();
            yield this.PythonJobRunner.RunLocally(`python3 ${this.StartFile} > ${this.JobDirectory}/${this.PythonLogs}`, true, this.JobDirectory).catch(e => {
                console.log(e);
                e.name += `: Run Job (${this.JobName})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                this.JobFinished = true;
                return;
            });
            this.JobFinished = true;
        });
    }
    SendPythonLogs(message) {
        message.AddFile(this.PythonLogs);
        const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
        const syncInfo = dataManager.GetSCPInfo(this.JobAuthor);
        //return SSHManager.GetSCPCommand(syncInfo, `${this.ArchiveDirectory}/${this.ArchiveFile}`, syncInfo.DownloadLocation);
        this.SendFile(message, `${this.JobDirectory}/${this.PythonLogs}`, `Python Logs are too large, it can be downloaded using the command: ${dna_discord_framework_1.SSHManager.GetSCPCommand(syncInfo, `${this.JobDirectory}/${this.PythonLogs}`, syncInfo.DownloadLocation)}`);
        this.SendArchive(message, `Archive file is too large, it can be downloaded using the command ${dna_discord_framework_1.SSHManager.GetSCPCommand(syncInfo, `${this.ArchiveDirectory}/${this.ArchiveFile}`, syncInfo.DownloadLocation)}`);
        //message.AddTextFile(this.PythonJobRunner.StandardOutputLogs, this.PythonLogs);
    }
}
exports.default = PythonJob;
