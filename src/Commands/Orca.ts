import { BotData, OptionTypesEnum, BotDataManager, Command, BashScriptRunner, DefaultCommandHandler } from "dna-discord-framework"
import { CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import fs from "fs";
import path from "path";
import axios from "axios";
//import got from 'got';

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

        const fileName = data.name.split(".")[0];
        console.log(fileName);
        this.InputFileName = `${fileName}.inp`;
        this.OutputFileName = `${fileName}.out`;
        this.JobLocation = path.join(this.SaveLocation, fileName);
        console.log(fileName);
        console.log(fileName);
        console.log(fileName);
        fs.mkdirSync(this.JobLocation, { recursive: true });
        await this.downloadFile(data.url, path.join(this.JobLocation, this.InputFileName));

        let runner = new BashScriptRunner();

        await runner.RunLocally(`/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName}`)

    };

    FailMessages = ["Server Not Live"];
    Options = [
        {
            type: OptionTypesEnum.Attachment,
            name: "orcafile",
            description: "Orca File to Run through Orca",
            required: true,
        },
    ];
    MaxOutTimer = 0;
    CommandHandler = DefaultCommandHandler.Instance();

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