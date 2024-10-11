import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Help extends Command {
    /* <inheritdoc> */
    public CommandName = "help";

    /* <inheritdoc> */
    public CommandDescription = "Returns the Help Menu for the Bot";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const dataManager = BotData.Instance(OrcaBotDataManager);

        let scpCommand  = ""

        if (dataManager.PORT == 0) 
            scpCommand = `scp user@${dataManager.HOSTNAME}:${dataManager.HOST_DEVICE_MOUNT_LOCATION}/<archivename> <downloadlocation>`
        else
            scpCommand = `scp -P ${dataManager.PORT} user@${dataManager.HOSTNAME}:${dataManager.HOST_DEVICE_MOUNT_LOCATION}/<archivename> <downloadlocation>`


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
    };

    /* <inheritdoc> */
    public IsEphemeralResponse = true;
}

export = Help;