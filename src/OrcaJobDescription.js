"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const OrcaJobFile_1 = __importDefault(require("./OrcaJobFile"));
/**
 * A Class to Describe the Job and it's resources
 */
class OrcaJobDescription {
    /**
     * Default Constructor
     * @param job The OrcaJob to Describe
     */
    constructor(job) {
        this.JobName = job.JobName;
        this.OccupiedCores = this.GetNumberOfCores(job);
        this.StartTime = job.StartTime;
    }
    /**
     * Extracts the Number of Cores that will be used from the Input File
     * @param job The OrcaJob to Analyze
     * @returns The Number of Cores that will be used
     */
    GetNumberOfCores(job) {
        const file = fs_1.default.readFileSync(job.GetFullFilePath(OrcaJobFile_1.default.InputFile), 'utf8');
        const regexPattern = /PAL(\d+)/;
        const match = file.match(regexPattern);
        if (match)
            return parseInt(match[1]);
        else
            return 1;
    }
    /**
     * Gets the Elapsed Time since the Job Started in String format
     * @returns The Elapsed Time in Hours and Minutes
     */
    GetElapsedTime() {
        const now = Date.now();
        const elapsed = new Date(now - this.StartTime);
        const hours = elapsed.getUTCHours();
        const minutes = elapsed.getUTCMinutes();
        if (hours > 0)
            return `${hours} h:${minutes} m`;
        else
            return `${minutes} m`;
    }
}
exports.default = OrcaJobDescription;
