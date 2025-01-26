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
        this.PythonDetailedLogs = "";
        this.PythonPackage = `${this.JobName}.tar.gz`;
        this.PythonLogs = `${this.JobName}Logs.txt`;
        this.PythonDetailedLogs = `${this.JobName}DetailedLogs.txt`;
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
    SetupPythonEnvironment(message) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.ExtractPackage();
            if (!this.PythonDefaultFilesExist()) {
                message.AddMessage(`Package provided is not a Valid Python Package. Please provide a valid Python Package to Run. It must container a Install.txt file and a Start.py file`);
                return false;
            }
            if (!(yield this.InstallPackages())) {
                message.AddMessage(`Python Package Install Failed :warning:`);
                message.AddMessage(`Aborting Python Calculation :no_entry:`);
                return false;
            }
            message.AddMessage(`Python Environment Setup Complete`);
            return true;
        });
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
            let runner = new dna_discord_framework_1.BashScriptRunner();
            let file = fs_1.default.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
            this.PipPackages = file.split("\n").filter((line) => line.length > 0);
            let installResults = true;
            for (const pipPackage of this.PipPackages) {
                if (!installResults)
                    break;
                yield runner.RunLocally(`pip install ${pipPackage} --force`, true, this.JobDirectory).catch(e => {
                    e.name += `: Install Package (${pipPackage})`;
                    e.message += `\n\nDetails:\n${runner.StandardErrorLogs}\n`;
                    dataManager.AddErrorLog(e);
                    this.JobSuccess = false;
                    installResults = false;
                    const errorMessage = `Error occurred: \n${e.name}\n\nMessage: \n${e.message}\n`;
                    fs_1.default.appendFileSync(`${this.JobDirectory}/${this.PythonLogs}`, errorMessage);
                });
                fs_1.default.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Pip Install ${pipPackage} Standard Logs: ${runner.StandardOutputLogs}\n`);
                fs_1.default.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Pip Install ${pipPackage} Standard Error Logs: ${runner.StandardErrorLogs}\n`);
            }
            return installResults;
        });
    }
    UninstallPackages() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            for (const pipPackage of this.PipPackages) {
                yield runner.RunLocally(`pip uninstall -y ${pipPackage}`, true, this.JobDirectory).catch(e => {
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
            let runner = new dna_discord_framework_1.BashScriptRunner();
            yield runner.RunLocally(`python3 ${this.StartFile} > ${this.JobDirectory}/${this.PythonLogs}`, true, this.JobDirectory).catch(e => {
                console.log(e);
                e.name += `: Run Job (${this.JobName})`;
                e.message += `\n\nDetails:${runner.StandardErrorLogs}\n`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
                this.JobFinished = true;
                const errorMessage = `Error occurred:\n ${e.name}\n\nMessage: ${e.message}\n`;
                fs_1.default.appendFileSync(`${this.JobDirectory}/${this.PythonLogs}`, errorMessage);
                return;
            });
            fs_1.default.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Python Standard Logs: ${runner.StandardOutputLogs}\n`);
            fs_1.default.appendFileSync(`${this.JobDirectory}/${this.PythonDetailedLogs}`, `Python Standard Error Logs: ${runner.StandardErrorLogs}\n`);
            this.JobFinished = true;
        });
    }
    SendPythonLogs(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const syncInfo = dataManager.GetSCPInfo(this.JobAuthor);
            yield this.SendFile(message, `${this.JobDirectory}/${this.PythonLogs}`, `Python Logs are too large, it can be downloaded using the command: ${dna_discord_framework_1.SSHManager.GetSCPCommand(syncInfo, `${this.JobManager.HostJobDirectory}/${this.PythonLogs}`, syncInfo.DownloadLocation)}`);
            yield this.SendArchive(message, `Archive file is too large, it can be downloaded using the command ${this.JobManager.GetHostArchiveCopyCommand(syncInfo, this.JobName, syncInfo.DownloadLocation)}`);
        });
    }
}
exports.default = PythonJob;
