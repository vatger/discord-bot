import path from "path";
import fs from "fs";
import DiscordEvent from "../types/Event";
import {DiscordBotClient} from "./client";
import {CommandList, EventList} from "../index";
import Command from "../types/Command";

async function loadEvents(dir = path.resolve(__dirname, '../events')) {
    const files: string[] = fs.readdirSync(dir);

    for (const file of files)
    {
        const fileDesc = fs.statSync(`${dir}/${file}`);

        if (fileDesc.isDirectory())
        {
            await loadEvents(`${dir}/${file}`);
            continue;
        }

        const loadingEvent = await import(dir + "/" + file);
        const cmd: DiscordEvent = new loadingEvent.default();
        EventList.set(cmd.event.toString(), cmd);

        cmd.register(DiscordBotClient);
    }
}

async function loadCommands(dir = path.resolve(__dirname, '../commands')) {
    const files: string[] = fs.readdirSync(dir);

    for (const file of files)
    {
        const fileDesc = fs.statSync(`${dir}/${file}`);

        if (fileDesc.isDirectory())
        {
            await loadCommands(`${dir}/${file}`);
            continue;
        }

        const loadingCommand = await import(dir + "/" + file);
        const cmd: Command = new loadingCommand.default();
        CommandList.set(cmd.name, cmd);
    }
}

export default {
    loadEvents,
    loadCommands
}