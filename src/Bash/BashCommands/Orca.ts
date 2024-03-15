import BashScriptsEnum from "../BashScriptsEnum";
import IBashCommand from "../IBashCommand";
import BashCommandHandler from "../BashCommandHandler";
import PalworldBotDataManager from "../../PalworldBotDataManager"
import BashScript from "../BashScript";
import { BotData, OptionTypes, BotDataManager } from "dna-discord-framework"
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";
import axios from "axios";
//import got from 'got';

//Start works
class Orca extends BashScript implements IBashCommand {
    CommandName = "orca";
    CommandDescription = "Pings the Server to determine if it is Online";
    CustomCode =
        `
/Orca/orca /home/orca/input.inp > /home/orca/output.out
`;
    SubCommands = [BashScriptsEnum.Custom];
    CommandFunction = async (interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const data = interaction.options.getAttachment("orcafile");
        const saveLocation = "/home/orca";

        if (data) 
            await downloadFile(data.url, path.join(saveLocation, "input.inp"));
    }
    ReplyMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
    LogMessage = "Server is Running an Orca Calculation :arrows_clockwise:";
    ErrorMessage = ":warning: Server couldn't run the Orca Calculation :warning:";
    SuccessMessage = ":white_check_mark: Server has completed the Orca Calculation :white_check_mark:";
    FailMessages = ["Server Not Live"];
    Options = [
        {
            type: OptionTypes.Attachment,
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

export = Orca;