import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import OrcaBotDataManager from "../OrcaBotDataManager";
import fs from "fs";
import OrcaJob from "../OrcaJob";
import OrcaJobManager from "../OrcaJobManager";
import SCPInfo from "../SCPInfo";
import Job from "../Jobs/Job";

/**
 * Command that Purges all Job Folders in the Job Directory
 */
class Download extends Command {
    /* <inheritdoc> */
    public CommandName = "download";

    /* <inheritdoc> */
    public CommandDescription = "Sends the Full Archive File as a Ephemeral Message, or returns the SCP Copy Command to Download.";

    /* <inheritdoc> */
    public IsCommandBlocking: boolean = false;

    /**
    * The Username of the User who called the Command
    */
    public DiscordUser: string = "";

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const archiveName = interaction.options.getString("archivename");
        const dataManager = BotData.Instance(OrcaBotDataManager);
        this.DiscordUser = interaction.user.username;

        if (!dataManager.IsDiscorcaSetup()) {
            this.AddToMessage("Discorca has not been setup yet. Run the /setup Command to Configure Discorca");
            return;
        }

        if (!archiveName) {
            this.AddToMessage("The Archive Name has not been Supplied, cannot Download a File without an Archive Name");
            return;
        }

        /*
        if (!Object.keys(dataManager.DISCORD_USER_SCP_INFO).includes(this.DiscordUser)) {
            this.AddToMessage("The SCP Information for the User has not been Setup. Run the /registersync Command to Configure SCP Information.");
            return;
        }
            */

        try {
            if (!Object.keys(dataManager.JOB_ARCHIVE_MAP).includes(archiveName)) {
                this.AddToMessage(`The Archive Name ${archiveName} is not Valid. Use /listarchive to list all Downloadable Archives.`);
                return;
            }
            const scpInfo: SCPInfo = dataManager.GetSCPInfo(this.DiscordUser);
            const orcaJobManager = new OrcaJobManager();
            const orcaJob: OrcaJob = dataManager.JOB_ARCHIVE_MAP[archiveName] as OrcaJob;
            const filePath = this.GetArchiveFilePath(orcaJob);

            if (!fs.existsSync(filePath)) {
                this.AddToMessage(`The Archive File for ${archiveName} doesn't Exist. Please let the Calculation Finish and Try Again.`);
                return;
            }

            this.AddToMessage("File is found in Archive, Uploading...");
            const size = this.GetFileSize(filePath);

            if (size[0] > dataManager.ZIP_FILE_MAX_SIZE_MB && size[1] == "MB")
                this.AddToMessage(`The Archive File is too Large (${size[0]} MB), it can be Downloaded using the Following Command ${orcaJobManager.GetHostArchiveCopyCommand(scpInfo, orcaJob.JobName)}`);
            else
                this.AddFileToMessage(filePath);
        } catch (error) {
            console.error(`Error in Download Command: ${error}`);
        }
    };

    public GetArchiveFilePath (orcaJob: OrcaJob): string {
        return `${orcaJob.JobManager.JobGlobalDirectory}/${orcaJob.JobManager.JobCategory}/${Job.ArchiveSubdirectory}/${orcaJob.JobName}/${orcaJob.ArchiveFile}`;
    }

    GetFileSize(filePath: string): [Number, string] {

        if (!fs.existsSync(filePath))
            return [0, "B"];

        const fileStats = fs.statSync(filePath);

        let realsize;
        let sizeFormat;

        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        } else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        } else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }

        return [realsize, sizeFormat];
    }

    /* <inheritdoc> */
    public IsEphemeralResponse = true;

    /* <inheritdoc> */
    public Options?: ICommandOption[] = [
        {
            name: "archivename",
            description: "The Name of the Archive to Download",
            required: true,
            type: OptionTypesEnum.String
        }
    ];
}

export = Download;