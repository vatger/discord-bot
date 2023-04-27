import {REST, Routes, SlashCommandBuilder} from "discord.js";
import {Config} from "../src/core/config";
import fs from "fs";
import path from "path"
import SlashCommand from "../src/types/Command";

const rest: REST = new REST({version: '10'}).setToken(Config.BOT_TOKEN);

let commands: SlashCommandBuilder[] = [];

(async function loadCommands(dir = path.resolve(__dirname, '../src/commands')) {
    const files: string[] = fs.readdirSync(dir);

    // Get commands
    for (const file of files)
    {
        console.log("Adding: ", file)
        const fileDesc = fs.statSync(`${dir}/${file}`);

        if (fileDesc.isDirectory())
        {
            await loadCommands(`${dir}/${file}`);
            continue;
        }

        const loadingCommand = await import(dir + "/" + file);
        const cmd: SlashCommand = new loadingCommand.default();
        commands.push(cmd.build());
    }

    console.log("Registering the following commands: ", commands.map(c => c.name));

    try {
        await rest.put(Routes.applicationGuildCommands(Config.CLIENT_ID, Config.GUILD_ID), {body: commands})
    } catch (e: any) {
        console.error(e);
    }
})();