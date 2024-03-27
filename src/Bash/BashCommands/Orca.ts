import BashScriptsEnum from "../BashScriptsEnum";
import IBashCommand from "../IBashCommand";
import BashCommandHandler from "../BashCommandHandler";
import PalworldBotDataManager from "../../PalworldBotDataManager"
import BashScript from "../BashScript";
import { BotData, OptionTypesEnum, BotDataManager } from "dna-discord-framework"
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";
import axios from "axios";
//import got from 'got';

//Start works
class Orca extends BashScript implements IBashCommand {
    SaveLocation: string = "/OrcaJobs";
    InputFileName: string ="";
    OutputFileName: string ="";
    JobLocation: string = "";
    CustomCode: string = `/Orca/orca  ${this.JobLocation}/${this.InputFileName}  > ${this.JobLocation}/${this.OutputFileName}`;
    CommandName = "orca";
    CommandDescription = "Pings the Server to determine if it is Online";
    //CustomCode = getCommand(this);
    SubCommands = [BashScriptsEnum.Custom];
    CommandFunction = async (interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        const data = interaction.options.getAttachment("orcafile");

        if (data) {
            const fileName = data.name.split(".")[0];
            console.log(fileName);
            this.InputFileName = `${fileName}.inp`;
            this.OutputFileName = `${fileName}.out`;
            this.JobLocation = path.join(this.SaveLocation, fileName);
            console.log(fileName);
            console.log(fileName);
            console.log(fileName);
            fs.mkdirSync(this.JobLocation, { recursive: true });
            await downloadFile(data.url, path.join(this.JobLocation, this.InputFileName));
            this.CustomCode = `/Orca/orca  ${this.JobLocation}/${this.InputFileName} > ${this.JobLocation}/${this.OutputFileName}`;
        }
    }
    ReplyMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
    LogMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
    ErrorMessage = ":warning: Server couldn't run the Orca Calculation :warning:";
    SuccessMessage = ":white_check_mark: Server has completed the Orca Calculation :white_check_mark:";
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
    CommandHandler = BashCommandHandler.Instance();
}

async function downloadFile(fileUrl: string, outputPath: string) {
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

function getCommand (orca: Orca): string 
{
    console.log(orca.JobLocation);
    return `Orca/orca  ${orca.JobLocation}/${orca.InputFileName}  > ${orca.JobLocation}/${orca.OutputFileName}`
}

export = Orca;