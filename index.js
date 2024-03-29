"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldBotDataManager_1 = __importDefault(require("./src/PalworldBotDataManager"));
const Bot = new dna_discord_framework_1.DiscordBot(PalworldBotDataManager_1.default);
Bot.StartBot();
console.log(process.cwd() + "/src");
let search = new dna_discord_framework_1.FileSearch();
console.log(search.GetFiles(process.cwd() + "/src", ".js"));
console.log(search.GetFiles(process.cwd() + "\\src", ".js"));
