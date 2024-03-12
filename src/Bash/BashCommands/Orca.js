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
const BashScriptsEnum_1 = __importDefault(require("../BashScriptsEnum"));
const BashCommandHandler_1 = __importDefault(require("../BashCommandHandler"));
const BashScript_1 = __importDefault(require("../BashScript"));
const dna_discord_framework_1 = require("dna-discord-framework");
//Start works
class Orca extends BashScript_1.default {
    constructor() {
        super(...arguments);
        this.CommandName = "orca";
        this.CommandDescription = "Pings the Server to determine if it is Online";
        this.CustomCode = `
/Orca/orca /home/orca/water.inp
`;
        this.SubCommands = [BashScriptsEnum_1.default.Custom];
        this.CommandFunction = (interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
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
        });
        this.ReplyMessage = "Server is being Pinged :arrows_clockwise:";
        this.LogMessage = "Server is being Pinged :arrows_clockwise:";
        this.ErrorMessage = ":warning: Server is not Online :warning:";
        this.SuccessMessage = ":white_check_mark: Server is Online :white_check_mark:";
        this.FailMessages = ["Server Not Live"];
        this.Options = [
            {
                type: dna_discord_framework_1.OptionTypes.Attachment,
                name: "orcafile",
                description: "Orca File to Run through Orca",
                required: true,
            },
        ];
        this.MaxOutTimer = 0;
        this.CommandHandler = BashCommandHandler_1.default.Instance();
    }
}
module.exports = Orca;
