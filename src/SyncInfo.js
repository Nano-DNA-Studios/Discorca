"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const SSHInfo_1 = __importDefault(require("./SSH/SSHInfo"));
class SyncInfo extends SSHInfo_1.default {
    constructor(hostname, port, username, password, downloadLocation) {
        super(hostname, port, username, password);
        this.DownloadLocation = downloadLocation;
    }
}
SyncInfo.DefaultSyncInfo = new SyncInfo("", 0, "", "", "");
exports.default = SyncInfo;
