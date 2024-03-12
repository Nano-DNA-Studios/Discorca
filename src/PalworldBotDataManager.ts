import { BotDataManager } from "dna-discord-framework";


/**
 * Class Handling Data Management
 */
class PalworldBotDataManager extends BotDataManager {

    /**
     * Name of the Process that Handles the Palworld Server
     */
    public SERVER_PROCESS_NAME: string = "";

    /**
     * Name of the Script that Starts the Palworld Server
     */
    public SERVER_START_SCRIPT: string = "";

    /**
     * If the Bot is running locally on the same computer as the Palworld Server hosted or will SSH to communicate
     */
    public RUN_LOCALLY: boolean = true;

    /**
     * IP of the Server to SSH into 
     */
    public SERVER_IP: string = "";

    /**
     * User of the Server to SSH into 
     */
    public SERVER_USER: string = "";

    /**
     * Port of the Server to SSH into 
     */
    public SERVER_PORT: string = "";

    /**
     * Password of the Server to SSH into 
     */
    public SERVER_PASSWORD: string = "";

    /**
     * Directory the Palworld Server is installed in
     */
    public STEAM_INSTALL_DIR: string = "";

    /**
     * Directory the Account Information is stored in
     */
    public ACCOUNT_PATH: string = "";

    /**
     * Initializes the Data Manager
     * @param botDirectory The Directory that the Bot is located in
     */
    constructor() {
        super();

        this.SERVER_PROCESS_NAME = "PalServer-Linux-Test";
        this.SERVER_START_SCRIPT = "PalServer.sh";
    }

    /**
     * Sets the SSH Server Information to login to the Server
     * @param serverIP IP of the Server
     * @param serverUser User on the Server
     * @param serverPort Port of the Server
     * @param serverPassword Password of the Server
     */
    public SetSSHSettings(serverIP: string, serverUser: string, serverPort: string, serverPassword: string) {
        this.SERVER_IP = serverIP;
        this.SERVER_USER = serverUser;
        this.SERVER_PORT = serverPort;
        this.SERVER_PASSWORD = serverPassword;

        this.SaveData();
    }

    /**
     * Sets the Run Locally Boolean
     * @param runLocally Boolean determining if the server is running locally or not. If true, the server is running locally. If false, the server is running remotely and needs to be SSH'd into.
     */
    public SetRunLocally(runLocally: boolean) {
        this.RUN_LOCALLY = runLocally;

        this.SaveData();
    }

    /**
     * Sets the Steam Install Directory
     * @param steamInstallDir Directory the Palworld Server is installed in
     */
    public SetSteamInstallDir(accountPath: string, steamInstallDir: string) {
        this.STEAM_INSTALL_DIR = steamInstallDir;
        this.ACCOUNT_PATH = accountPath;

        this.SaveData();
    }
}

export default PalworldBotDataManager;
