import SSHInfo from "./SSHInfo";


class SSHManager 
{
    public static GetSCPCommand(scpInfo: SSHInfo, sourcePath : string, destinationPath: string, isDirectory: boolean = false): string {
        const user = scpInfo?.Username;
        const hostName = scpInfo?.HostName;
        const port = scpInfo?.Port;
        let command = "";
        let recursive = "";

        if (isDirectory)
        {
            sourcePath += "/";
            recursive = "-r ";
        }

        if (!(user && destinationPath && hostName)) {
            const command = `scp ${recursive}-P port serverUser@hostName:${sourcePath} /Path/on/local/device`;
            return "```" + command + "```"
        }

        if (port == 0)
            command = `scp ${recursive}${user}@${hostName}:${sourcePath} ${destinationPath}`;
        else
            command = `scp ${recursive}-P ${port} ${user}@${hostName}:\"${sourcePath}\" \"${destinationPath}\"`;

        return "```" + command + "```";
    }
}

export default SSHManager;