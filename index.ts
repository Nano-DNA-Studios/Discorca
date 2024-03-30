import { DiscordBot } from "dna-discord-framework";
import PalworldBotDataManager from "./src/PalworldBotDataManager";

const Bot = new DiscordBot(PalworldBotDataManager);

Bot.StartBot();

console.log("Bot Started");

