"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SSHInfo {
    constructor(hostname, port, username, password) {
        this.HostName = hostname;
        this.Port = port;
        this.Username = username;
        this.Password = password;
    }
}
exports.default = SSHInfo;
