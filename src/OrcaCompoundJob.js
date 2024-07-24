"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const OrcaJob_1 = __importDefault(require("./OrcaJob"));
class OrcaCompoundJob extends OrcaJob_1.default {
    constructor(jobName, xyzFiles) {
        super(jobName);
        this.XYZFiles = [];
        this.JobName = jobName.split(".")[0];
        this.InputFileName = `${this.JobName}.cmp`;
        this.XYZFiles = xyzFiles;
    }
}
exports.default = OrcaCompoundJob;
