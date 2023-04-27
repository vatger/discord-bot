import {Collection, GatewayIntentBits} from "discord.js";
import Command from './types/Command';
import {BotClient} from "./core/client";
import {Config} from "./core/config";
import fs from "fs";
import path from "path"
import DiscordEvent from "./types/Event";

export const CommandList = new Collection<string, Command>();
export const EventList = new Collection<string, DiscordEvent>();

const loadingEvents = (async function loadEvents(dir = path.resolve(__dirname, './events')) {
    const files: string[] = fs.readdirSync(dir);

    for (const file of files)
    {
        const loadingEvent = await import(dir + "/" + file);
        const cmd: DiscordEvent = new loadingEvent.default();
        EventList.set(cmd.event.toString(), cmd);

        cmd.register(BotClient);
        console.log("Loaded Event: ", cmd.event.toString());
    }
})()

const loadingCommands = (async function loadCommands(dir = path.resolve(__dirname, './commands')) {
    const files: string[] = fs.readdirSync(dir);

    for (const file of files)
    {
        const loadingCommand = await import(dir + "/" + file);
        const cmd: Command = new loadingCommand.default();
        CommandList.set(cmd.name, cmd);

        console.log("Loaded Command: ", cmd.name);
    }
})()

Promise.all([loadingEvents, loadingCommands]).then(() => {
    console.log("Finished Loading Commands. Logging in");

    BotClient.login(Config.BOT_TOKEN)
        .then(() => {
            console.log("Logged in!");
        });
})