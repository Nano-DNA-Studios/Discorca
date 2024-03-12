import { Client } from "ssh2";
import BashScript from "./BashScript";
import BotDataManager from "../PalworldBotDataManager";
import exec from "child_process";

/**
 * Runs Bash Scripts provided from a Bash Command
 */
class BashScriptRunner {

    /**
     * Data Manager for the Bot
     */
    private _dataManager: BotDataManager;

    /**
     * Result of the Bash Script Running Successfully
     */
    private _scriptRanSuccessfully: boolean = true;

    /**
     * Bash Command to Run
     */
    public BashCommand: BashScript;

    /**
     * Initializes the Bash Script Runner
     * @param bashCommand The Bash Command to Run
     * @param BotDataManager The Bot Data Manager
     */
    constructor(bashCommand: BashScript, BotDataManager: BotDataManager) {
        this._dataManager = BotDataManager;
        this.BashCommand = bashCommand;
    }

    /**
     * Determines if the Output of the Bash Script is an Error
     * @param data The Output of the Bash Script
     */
    private DetermineError(data: any): void {
        let Fails = this.BashCommand.FailMessages;
        let dataStr = data.toString().replace(/\r?\n|\r/g, "");
        if (Fails.includes(dataStr)) {
            this._scriptRanSuccessfully = false;
        }
    }

    /**
     * Runs the Bash Script
     * @returns True if the Script Ran Successfully, False if it did not
     */
    public async RunBashScript(): Promise<boolean> {
        this._scriptRanSuccessfully = true;

        const Script = await this.BashCommand.GetCode();

        if (this._dataManager.RUN_LOCALLY)
            return this.RunLocally(Script);
        else
            return this.RunThroughSHH(Script);
    }

//, {cwd: '/home/orca'}

    /**
     * Runs a Bash Script through a local execution
     * @param Script Bash Script to Run
     * @returns True if no errors occurred, False if an error occurred (Errors are defined by the Bash Command Fail Messages)
     */
    async RunLocally(Script: string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            exec.exec(`${Script}`, (error, stdout, stderr) => {

                if (error) {
                    console.error(`exec error: ${error}`);
                }
                if (stderr) {
                    console.error(`stderr: ${stderr}`);
                }

                console.log(`STDOUT: ${stdout}`);
                resolve(this._scriptRanSuccessfully);
            });
        });
    }

    /**
     * Runs a Bash Script through an SSH Connection
     * @param Script Bash Script to Run
     * @returns True if no errors occurred, False if an error occurred (Errors are defined by the Bash Command Fail Messages)
     */
    async RunThroughSHH(Script: string): Promise<boolean> {

        const ServerConnection = await this.ConnectToServer();

        return new Promise<boolean>((resolve, reject) => {
            ServerConnection.exec(`${Script}`, (err, stream) => {
                if (err) throw err;

                let dataBuffer = "";

                if (this.BashCommand.HasMaxOutTimer()) {
                    console.log("Max Timeout Set");
                    setTimeout(() => {
                        console.log("Max Timeout Reached");
                        resolve(this._scriptRanSuccessfully);
                        stream.end();
                    }, this.BashCommand.MaxOutTimer);
                }

                stream
                    .on("close", (code: string, signal: string) => {
                        resolve(this._scriptRanSuccessfully);
                    })
                    .on("data", (data: string) => {
                        dataBuffer += data;
                        console.log("STDOUT: " + data);
                        this.DetermineError(data);
                    })
                    .stderr.on("data", (data) => {
                        console.error("STDERR: " + data);
                        this.DetermineError(data);
                    });
            });
        });
    }

    /**
     * Connects to a Server through SSH
     * @returns A Promise to the SSH Client
     */
    ConnectToServer(): Promise<Client> {
        return new Promise((resolve, reject) => {
            const conn = new Client();
            conn.on('ready', () => {
                console.log('SSH Connection ready');
                resolve(conn); // Resolve with the connection instance
            }).on('error', (err) => {
                console.error('SSH Connection error:', err);
                reject(err);
            }).connect({
                host: this._dataManager.SERVER_IP!,
                port: parseInt(this._dataManager.SERVER_PORT!),
                username: this._dataManager.SERVER_USER!,
                password: this._dataManager.SERVER_PASSWORD!
            });
        });
    }
}

export default BashScriptRunner;
