import { DiscordBot, BotDataManager, FileSearch} from "dna-discord-framework";
import PalworldBotDataManager from "./src/PalworldBotDataManager";

const Bot = new DiscordBot(PalworldBotDataManager);

Bot.StartBot();

console.log(process.cwd() + "/src");

let search = new FileSearch();
console.log(search.GetFiles(process.cwd() + "/src", ".js"))
console.log(search.GetFiles(process.cwd() + "\\src", ".js"))

