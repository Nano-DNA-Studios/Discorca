"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Help extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "help";
        /* <inheritdoc> */
        this.CommandDescription = "Returns the Help Menu for the Bot";
        /* <inheritdoc> */
        this.IsCommandBlocking = false;
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            let scpCommand = "";
            if (dataManager.PORT == 0)
                scpCommand = `scp user@${dataManager.HOSTNAME}:${dataManager.HOST_DEVICE_MOUNT_LOCATION}/<archivename> <downloadlocation>`;
            else
                scpCommand = `scp -P ${dataManager.PORT} user@${dataManager.HOSTNAME}:${dataManager.HOST_DEVICE_MOUNT_LOCATION}/<archivename> <downloadlocation>`;
            let message = `Hello! I am Discorca, a Discord Bot that can run Orca and Python Jobs for you.

If you are new here I suggest you run the /registersync command to setup your Sync Folder

If you need to transfer files to your device, you can use the following command to download the files (Ryan this is for you)

${scpCommand}

Else you are probably looking for some help with my other command

**Download**
Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download to your Device
*archivename* - The Name of the Archive to Download

**Orca**
Runs an Orca Calculation on the Server
*Input File* : Orca Input file to run
*XYZ File 1 - 5* : Additional XYZ File that can be referenced

**Python**
Runs a Python Job on the Server and returns the results
*Python Package* : The Python Package containing essential files and the code to run

**Purge**
Allows the User to Purge the Jobs Directory or the Job Archive Directory
*Purge Type* : The type of Purge to run (Jobs or Archive)

**Register Sync**
Registers a new User for Syncing
*User* : The Username of the Servers account (The user you SSH into)
*Download Location* : The Absolute Path to the Folder you want to SCP copy files on your personal Device.

**Setup**
Sets up Discorca for the first time by setting SSH info and preferences.
*Hostname* : Hostname of Device/Server (Often just IP Address)
*Mount Location* : Paste in the path you selected for path/to/job/archive
*MaxZipFile* : The maximum Zip file size to send over Discord (Modified through server boosts)
*Port* : The SSH Port to login to device (Set to 0 if you dont need to specify ports for SSH)
*Calculation Channel* : The Text/Chat Channel the Bot will send Calculation Results to

**Status**
Displays Discorca’s Status, Resource Usage and Current running jobs

**Sync**
Syncs your Personal Device with the Archive on the Server
        `;
            this.AddToMessage(message);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
    }
}
module.exports = Help;
