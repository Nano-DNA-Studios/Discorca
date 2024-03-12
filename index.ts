import { DiscordBot, BotDataManager} from "dna-discord-framework";
import PalworldBotDataManager from "./src/PalworldBotDataManager";

const Bot = new DiscordBot(PalworldBotDataManager);

Bot.StartBot();


