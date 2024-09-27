"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SSHManager {
    static GetSCPCommand(scpInfo, sourcePath, destinationPath, isDirectory = false) {
        const user = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.Username;
        const hostName = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.HostName;
        const port = scpInfo === null || scpInfo === void 0 ? void 0 : scpInfo.Port;
        let command = "";
        let recursive = "";
        if (isDirectory) {
            sourcePath += "/";
            recursive = "-r ";
        }
        if (!(user && destinationPath && hostName)) {
            const command = `scp ${recursive}-P port serverUser@hostName:${sourcePath} /Path/on/local/device`;
            return "```" + command + "```";
        }
        if (port == 0)
            command = `scp ${recursive}${user}@${hostName}:${sourcePath} ${destinationPath}`;
        else
            command = `scp ${recursive}-P ${port} ${user}@${hostName}:\"${sourcePath}\" \"${destinationPath}\"`;
        return "```" + command + "```";
    }
}
exports.default = SSHManager;
