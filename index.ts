import { DiscordBot } from "dna-discord-framework";
import OrcaBotDataManager from "./src/OrcaBotDataManager";

const Bot = new DiscordBot(OrcaBotDataManager);

Bot.StartBot();

console.log("Bot Started");