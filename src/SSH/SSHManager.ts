

class SSHManager 
{

    static GetSCPCommand(source: string, destination: string): string {
        return `scp ${source} ${destination}`;
    }

}

export default SSHManager;