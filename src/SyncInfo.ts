import SSHInfo from "./SSH/SSHInfo";

class SyncInfo extends SSHInfo
{
    static DefaultSyncInfo: SyncInfo = new SyncInfo("", 0, "", "", "");

    public DownloadLocation: string;

    constructor(hostname: string, port: number, username: string, password: string, downloadLocation: string) {
        super(hostname, port, username, password);
        this.DownloadLocation = downloadLocation;
    }
}

export default SyncInfo;