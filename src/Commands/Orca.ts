import { OptionTypesEnum, BotDataManager, Command, BashScriptRunner, DefaultCommandHandler } from "dna-discord-framework"
import { CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import fs from "fs";
import path from "path";
import axios from "axios";

//Start works
class Orca extends Command {
    CommandName = "orca";
    CommandDescription = "Runs an Orca Calculation on the Server";
    RunningMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
    LogMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
    ErrorMessage = ":warning: Server couldn't run the Orca Calculation :warning:";
    SuccessMessage = ":white_check_mark: Server has completed the Orca Calculation :white_check_mark:";
    IsEphemeralResponse = false;
    SaveLocation: string = "/OrcaJobs";
    InputFileName: string = "";
    OutputFileName: string = "";
    JobLocation: string = "";
    CustomCode: string = `/Orca/orca  ${this.JobLocation}/${this.InputFileName}  > ${this.JobLocation}/${this.OutputFileName}`;

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const data = interaction.options.getAttachment("orcafile");

        if (!data)
            return;

        this.InitializeUserResponse(interaction, `Running Orca Calculation on ${data.name}`);

        const fileName = data.name.split(".")[0];
        this.InputFileName = `${fileName}.inp`;
        this.OutputFileName = `${fileName}.out`;
        this.JobLocation = path.join(this.SaveLocation, fileName);
        fs.mkdirSync(this.JobLocation, { recursive: true });
        await this.downloadFile(data.url, path.join(this.JobLocation, this.InputFileName));

        let runner = new BashScriptRunner();

        await runner.RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName} `);

        this.AddToResponseMessage(this.SuccessMessage);

        await runner.RunLocally(`tar -zcvf /OrcaJobsArchive/${fileName}.tar.gz -C /OrcaJobs ${fileName}`)

        this.Response.files?.push(`/OrcaJobsArchive/${fileName}.tar.gz`);

        this.AddToResponseMessage("Sending Compressed Job Archive");
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