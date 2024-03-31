"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
/**
 * Class Handling Data Management
 */
class OrcaBotDataManager extends dna_discord_framework_1.BotDataManager {
    // /**
    //  * Name of the Process that Handles the Palworld Server
    //  */
    // public SERVER_PROCESS_NAME: string = "";
    // /**
    //  * Name of the Script that Starts the Palworld Server
    //  */
    // public SERVER_START_SCRIPT: string = "";
    // /**
    //  * If the Bot is running locally on the same computer as the Palworld Server hosted or will SSH to communicate
    //  */
    // public RUN_LOCALLY: boolean = true;
    // /**
    //  * IP of the Server to SSH into 
    //  */
    // public SERVER_IP: string = "";
    // /**
    //  * User of the Server to SSH into 
    //  */
    // public SERVER_USER: string = "";
    // /**
    //  * Port of the Server to SSH into 
    //  */
    // public SERVER_PORT: string = "";
    // /**
    //  * Password of the Server to SSH into 
    //  */
    // public SERVER_PASSWORD: string = "";
    // /**
    //  * Directory the Palworld Server is installed in
    //  */
    // public STEAM_INSTALL_DIR: string = "";
    // /**
    //  * Directory the Account Information is stored in
    //  */
    // public ACCOUNT_PATH: string = "";
    /**
     * Initializes the Data Manager
     * @param botDirectory The Directory that the Bot is located in
     */
    constructor() {
        super();
        /**
         * The File Path on the Host Device that is storing the Mounted Data
         */
        this.HOST_DEVICE_MOUNT_LOCATION = "";
        this.HOSTNAME = "";
        this.SERVER_USER = {};
        this.DOWNLOAD_LOCATION = {};
    }
    // /**
    //  * Sets the SSH Server Information to login to the Server
    //  * @param serverIP IP of the Server
    //  * @param serverUser User on the Server
    //  * @param serverPort Port of the Server
    //  * @param serverPassword Password of the Server
    //  */
    // public SetSSHSettings(serverIP: string, serverUser: string, serverPort: string, serverPassword: string) {
    //     this.SERVER_IP = serverIP;
    //     this.SERVER_USER = serverUser;
    //     this.SERVER_PORT = serverPort;
    //     this.SERVER_PASSWORD = serverPassword;
    //     this.SaveData();
    // }
    // /**
    //  * Sets the Run Locally Boolean
    //  * @param runLocally Boolean determining if the server is running locally or not. If true, the server is running locally. If false, the server is running remotely and needs to be SSH'd into.
    //  */
    // public SetRunLocally(runLocally: boolean) {
    //     this.RUN_LOCALLY = runLocally;
    //     this.SaveData();
    // }
    // /**
    //  * Sets the Steam Install Directory
    //  * @param steamInstallDir Directory the Palworld Server is installed in
    //  */
    // public SetSteamInstallDir(accountPath: string, steamInstallDir: string) {
    //     this.STEAM_INSTALL_DIR = steamInstallDir;
    //     this.ACCOUNT_PATH = accountPath;
    //     this.SaveData();
    // }
    /**
     * Sets the Mounted Directory File Path (Used for creating the SCP Copy Command)
     * @param filepath The Path on the Host Device to the Mounted Directory
     */
    SetMountLocation(filepath) {
        this.HOST_DEVICE_MOUNT_LOCATION = filepath;
        this.SaveData();
    }
    /**
     * Sets the Host Name / Device Name of the Server
     * @param hostName The Host Name of the Server
     */
    SetHostName(hostName) {
        this.HOSTNAME = hostName;
        this.SaveData();
    }
    /**
     * Adds a Mapping of the Discord User to the Server User
     * @param discordUser The Discord User who called the Command
     * @param serverUser The Server User of the Discord User
     */
    AddServerUser(discordUser, serverUser) {
        this.SERVER_USER[discordUser] = serverUser;
        this.SaveData();
    }
    /**
     * Adds a Mapping of the Discord User to a Personalized Download Location
     * @param discordUser The Discord User who called the Command
     * @param downloadLocation The Download Location on the Discord Users Device
     */
    AddDownloadLocation(discordUser, downloadLocation) {
        this.DOWNLOAD_LOCATION[discordUser] = downloadLocation;
        this.SaveData();
    }
}
exports.default = OrcaBotDataManager;
