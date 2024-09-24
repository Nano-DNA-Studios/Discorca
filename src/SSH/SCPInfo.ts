import SSHInfo from "./SSHInfo";

class SCPInfo implements SSHInfo{
    public HostName: string;
    public Port: number;
    public Username: string;
    public Password: string;
    public DestinationPath: string;
    public SourcePath: string;

    constructor(sshInfo: SSHInfo, sourcePath: string,  destinationPath: string) {
        this.HostName = sshInfo.HostName;
        this.Port = sshInfo.Port;
        this.Username = sshInfo.Username;
        this.Password = sshInfo.Password;
        this.DestinationPath = destinationPath;
        this.SourcePath = sourcePath;
    }

    public GetSCPCommand(path: string): string {
        const user = this?.Username;
        const downloadLocation = this?.DestinationPath;
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