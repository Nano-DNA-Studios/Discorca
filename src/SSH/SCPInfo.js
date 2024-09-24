"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SCPInfo {
    constructor(sshInfo, downloadLocation) {
        this.HostName = sshInfo.HostName;
        this.Port = sshInfo.Port;
        this.Username = sshInfo.Username;
        this.Password = sshInfo.Password;
        this.DownloadLocation = downloadLocation;
    }
    GetSCPCommand(path) {
        const user = this === null || this === void 0 ? void 0 : this.Username;
        const downloadLocation = this === null || this === void 0 ? void 0 : this.DownloadLocation;
        const hostName = this === null || this === void 0 ? void 0 : this.HostName;
        const port = this === null || this === void 0 ? void 0 : this.Port;
        let command = "";
        if (!(user && downloadLocation && hostName)) {
            const command = `scp -P port serverUser@hostName:${path} /Path/on/local/device`;
            return "```" + command + "```";
        }
        if (port == 0)
            command = `scp ${user}@${hostName}:${path} ${downloadLocation}`;
        else
            command = `scp -P ${port} ${user}@${hostName}:${path} ${downloadLocation}`;
        return "```" + command + "```";
    }
}
exports.default = SCPInfo;
