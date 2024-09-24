
class SSHInfo {
    public HostName: string;
    public Port: number;
    public Username: string;
    public Password: string;

    constructor(hostname: string, port: number, username: string, password: string) {
        this.HostName = hostname;
        this.Port = port;
        this.Username = username;
        this.Password = password;
    }
}

export default SSHInfo;