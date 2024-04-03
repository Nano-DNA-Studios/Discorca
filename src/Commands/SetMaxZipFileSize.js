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
const dna_discord_framework_1 = require("dna-discord-framework");
const OrcaBotDataManager_1 = __importDefault(require("../OrcaBotDataManager"));
/**
 * Command that Sets the Max Zip Size
 */
class SetMaxZipSize extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = "setmaxzipsize";
        /* <inheritdoc> */
        this.CommandDescription = "Sets the Maximum Size a Zip File in Mega Bytes before Discorca returns an SCP Copy Command";
        /* <inheritdoc> */
        this.RunCommand = (client, interaction, BotDataManager) => __awaiter(this, void 0, void 0, function* () {
            this.InitializeUserResponse(interaction, "Setting Max Size");
            const dataManager = dna_discord_framework_1.BotData.Instance(OrcaBotDataManager_1.default);
            const maxsize = interaction.options.getNumber("maxsize");
            if (!dataManager) {
                this.AddToResponseMessage("Data Manager doesn't Exist, can't set the Download Location");
                return;
            }
            if (maxsize) {
                dataManager.SetMaxZipSize(maxsize);
                this.AddToResponseMessage(`The Max Size has been set to ${maxsize}`);
            }
            else
                this.AddToResponseMessage(`The Max Size has not been set or is invalid.`);
        });
        /* <inheritdoc> */
        this.IsEphemeralResponse = true;
        /* <inheritdoc> */
        this.Options = [
            {
                name: "maxsize",
                description: "The Maximum Size of a Zip File in Mega Bytes",
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.Number,
                choices: [
                    {
                        name: "5",
                        value: 5
                    },
                    {
                        name: "10",
                        value: 10
                    },
                    {
                        name: "20",
                        value: 20
                    },
                    {
                        name: "30",
                        value: 30
                    },
                    {
                        name: "40",
                        value: 40
                    },
                    {
                        name: "50",
                        value: 50
                    },
                    {
                        name: "60",
                        value: 60
                    },
                    {
                        name: "70",
                        value: 70
                    },
                    {
                        name: "80",
                        value: 80
                    },
                ]
            },
        ];
    }
}
module.exports = SetMaxZipSize;
