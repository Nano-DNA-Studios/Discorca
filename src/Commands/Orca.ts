import { OptionTypesEnum, BotDataManager, Command, BashScriptRunner, DefaultCommandHandler } from "dna-discord-framework"
import { Attachment, CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import fs from "fs";
import fsp from "fs/promises"
import path from "path";
import axios from "axios";

//Start works
class Orca extends Command {
    CommandName = "orca";
    CommandDescription = "Runs an Orca Calculation on the Server";
    IsEphemeralResponse = false;
    SaveLocation: string = "/OrcaJobs";

    JobLocation: string = "";
    //CustomCode: string = `/Orca/orca  ${this.JobLocation}/${this.InputFileName}  > ${this.JobLocation}/${this.OutputFileName}`;

    FileName: string = "";
    JobArchiveFolder: string = "";


    InputFileName: string = "";
    OutputFileName: string = "";
    XYZFileName: string = "";
    TrjXYZFileName: string = "";
    ECEServerArchive = "/homeFAST/OrcaJobArchive";
    CopyCommand: string = "";
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const data = interaction.options.getAttachment("orcafile");

        if (!data)
            return;

        this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);

        await this.SetPaths(data);
        await this.CreateDirectories();
        await this.downloadFile(data.url, path.join(this.JobLocation, this.InputFileName));

        await new BashScriptRunner().RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);

        // await runner.RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);

        this.AddToResponseMessage(":white_check_mark: Server has completed the Orca Calculation :white_check_mark:");

        await this.SendAllFiles();

    };
    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "orcafile",
            description: "Orca File to Run through Orca",
            required: true,
        },
    ];
    CommandHandler = DefaultCommandHandler.Instance();

    SetPaths(data: Attachment) {
        this.FileName = data.name.split(".")[0];
        this.InputFileName = `${this.FileName}.inp`;
        this.OutputFileName = `${this.FileName}.out`;
        this.XYZFileName = `${this.FileName}.xyz`;
        this.TrjXYZFileName = `${this.FileName}_trj.xyz`;
        this.JobLocation = path.join(this.SaveLocation, this.FileName);
        this.JobArchiveFolder = `/OrcaJobsArchive/${this.FileName}`;
    }

    CreateDirectories() {
        try { fs.rmSync(this.JobLocation, { recursive: true, force: true }); } catch (e) { }
        try { fs.mkdirSync(this.JobLocation, { recursive: true }); } catch (e) { }

        try { fs.rmSync(this.JobArchiveFolder, { recursive: true, force: true }); } catch (e) { }
        try { fs.mkdirSync(this.JobArchiveFolder); } catch (e) { }
    }

    CreateCopyCommand(fileName: string) {
        let command = `scp WATID@iccad5:${this.ECEServerArchive}/${this.FileName}/${fileName} C:/Users/MrDNA/Downloads`;

        this.CopyCommand = "```" + command + "```"
    }

    async SendAllFiles() {
        await this.SendFile(this.OutputFileName);
        await this.SendFile(this.XYZFileName);
        await this.SendFile(this.TrjXYZFileName);
        await this.SendFullJobArchive();
    }


    async SendFile(fileName: string) {
        try {
            this.CreateCopyCommand(fileName);

            let filePath = `${this.JobArchiveFolder}/${fileName}`;

            fs.copyFileSync(`${this.JobLocation}/${fileName}`, filePath, fs.constants.COPYFILE_EXCL);

            const fileStats = await fsp.stat(filePath);

            let sizeAndFormat = this.GetFileSize(fileStats);

            if (sizeAndFormat[0] > 5 && sizeAndFormat[1] == "MB") {
                this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.CopyCommand}`);
            } else {
                this.AddFileToResponseMessage(filePath);
            }
        } catch (e) {
            console.log(e);
        }
    }

    async SendFullJobArchive() {
        try {
            let fileName = `${this.FileName}Full.tar.gz`
            let filePath = `${this.JobArchiveFolder}/${fileName}`
            let runner = new BashScriptRunner();

            await runner.RunLocally(`tar -zcvf ${filePath} -C /OrcaJobs ${this.FileName}`);

            const fileStats = await fsp.stat(filePath);

            this.CreateCopyCommand(`${this.FileName}Full.tar.gz`)

            let sizeAndFormat = this.GetFileSize(fileStats)

            if (sizeAndFormat[0] > 80 && sizeAndFormat[1] == "MB")
                this.AddToResponseMessage(`The Output file is too large (${sizeAndFormat[0]} ${sizeAndFormat[1]}), it can be downloaded through the following command ${this.CopyCommand}`);
            else
                this.AddFileToResponseMessage(filePath);

        } catch (e) {

        }
    }

    GetFileSize(fileStats: fs.Stats): [number, string] {
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

    /**
     * Simple function to download a file from a URL
     * @param fileUrl The URL of the file to download
     * @param outputPath The Path to download the file to
     * @returns A promise telling when the download is complete
     */
    async downloadFile(fileUrl: string, outputPath: string) {
        try {
            const response = await axios({
                method: 'GET',
                url: fileUrl,
                responseType: 'stream',
            });

            const writer = fs.createWriteStream(outputPath);

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }
}

export = Orca;