import { BotData, DiscordBot } from "dna-discord-framework";
import OrcaBotDataManager from "./src/OrcaBotDataManager";

const Bot = new DiscordBot(OrcaBotDataManager);

Bot.StartBot();

console.log("Bot Started");


let dataManager = BotData.Instance(OrcaBotDataManager);

dataManager.ClearJobs();

setTimeout(() => {BotData.Instance(OrcaBotDataManager).SetActivityToListen(Bot.BotInstance);} , 2500);