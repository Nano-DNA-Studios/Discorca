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
        this.PythonPackage = "PythonPackage.tar.gz";
        this.InstallFile = "Install.txt";
        this.StartFile = "Start.py";
        this.PythonPackage = `${this.JobName}.tar.gz`;
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
    InstallPackages(message) {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let file = fs_1.default.readFileSync(`${this.JobDirectory}/${this.InstallFile}`, 'utf8');
            let packages = file.split("\n").filter((line) => line.length > 0);
            yield packages.forEach((pipPackage) => __awaiter(this, void 0, void 0, function* () {
                let runner = new dna_discord_framework_1.BashScriptRunner();
                yield runner.RunLocally(`pip install ${pipPackage}`, true, this.JobDirectory).catch(e => {
                    e.name += `: Install Package (${pipPackage})`;
                    dataManager.AddErrorLog(e);
                    this.JobSuccess = false;
                    message.AddMessage(`Failed to Install Package : ${pipPackage}`);
                    return;
                });
            }));
        });
    }
    RunJob() {
        return __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            //This is how we generate packages
            //tar -zcvf name.tar.gz -C /home/mrdna/tests ./*
            //tar -xzf file.tar.gz (Extracts the tar file)
            let runner = new dna_discord_framework_1.BashScriptRunner();
            yield runner.RunLocally(`python3 ${this.StartFile}`, true, this.JobDirectory).catch(e => {
                console.log(e);
                e.name += `: Run Job (${this.JobName})`;
                dataManager.AddErrorLog(e);
                this.JobSuccess = false;
            });
            console.log("Job Finished");
            console.log(runner.StandardOutputLogs);
            this.JobFinished = true;
        });
    }
}
exports.default = PythonJob;
