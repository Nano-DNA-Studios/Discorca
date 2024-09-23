import SSHInfo from "./SSHInfo";

class SCPInfo {
    public DownloadLocation: string;
    public HostName: string;
    public Port: number;
    public Username: string;
    public Password: string;

    constructor(sshInfo: SSHInfo, downloadLocation: string) {
        this.HostName = sshInfo.HostName;
        this.Port = sshInfo.Port;
        this.Username = sshInfo.Username;
        this.Password = sshInfo.Password;
        this.DownloadLocation = downloadLocation
    }

    public GetSCPCommand(path: string): string {
        const user = this?.Username;
        const downloadLocation = this?.DownloadLocation;
        const hostName = this?.HostName;
        const port = this?.Port;
        let command = "";

        if (!(user && downloadLocation && hostName)) {
            const command = `scp -P port serverUser@hostName:${path} /Path/on/local/device`;
            return "```" + command + "```"
        }

        if (port == 0)
            command = `scp ${user}@${hostName}:${path} ${downloadLocation}`;
        else
            command = `scp -P ${port} ${user}@${hostName}:${path} ${downloadLocation}`;

        return "```" + command + "```";
    }
}

export default SCPInfo;