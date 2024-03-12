import BashScriptsEnum from "../BashScriptsEnum";
import IBashCommand from "../IBashCommand";
import BashCommandHandler from "../BashCommandHandler";
import PalworldBotDataManager from "../../PalworldBotDataManager"
import BashScript from "../BashScript";
import { BotData, OptionTypes, BotDataManager } from "dna-discord-framework"
import { CacheType, ChatInputCommandInteraction } from "discord.js";
import fs from "fs";
import path from "path";

//Start works
class Orca extends BashScript implements IBashCommand {
    CommandName = "orca";
    CommandDescription = "Pings the Server to determine if it is Online";
    CustomCode =
        `
/Orca/orca /home/orca/water.inp
`;
    SubCommands = [BashScriptsEnum.Custom];
    CommandFunction = async (interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        console.log("Ping Command Executed");


        const data = interaction.options.getAttachment("orcafile");

        console.log(data);

       // const {default: fetch} = await import('node-fetch');

       //const fetch = (args:string) => import('node-fetch').then(({default: fetch}) => fetch(args));

       /*
       const fetch = (await import('node-fetch')).default;

        

       

        const saveLocation = "/home/orca";

        if (data) {

            const response = await fetch(data.url);
            const buffer = await response.buffer();
            await fs.writeFile(path.join(saveLocation, 'downloads', data.name), buffer, () =>
                console.log('finished downloading!'));
            
        }
        */
    }
    ReplyMessage = "Server is being Pinged :arrows_clockwise:";
    LogMessage = "Server is being Pinged :arrows_clockwise:";
    ErrorMessage = ":warning: Server is not Online :warning:";
    SuccessMessage = ":white_check_mark: Server is Online :white_check_mark:";
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

export = Orca;