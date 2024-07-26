"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("./src/OrcaBotDataManager"));
const Bot = new dna_discord_framework_1.DiscordBot(OrcaBotDataManager_1.default);
Bot.StartBot();
console.log("Bot Started");
dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).ClearJobs();
setTimeout(() => { dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default).SetActivityToListen(Bot.BotInstance); }, 2500);
