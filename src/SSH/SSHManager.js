"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SSHManager {
    static GetSCPCommand(source, destination) {
        return `scp ${source} ${destination}`;
    }
}
exports.default = SSHManager;
