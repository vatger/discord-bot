import { Collection, GatewayIntentBits, ActivityType } from 'discord.js';
import Command from './types/Command';
import Client, { DiscordBotClient } from './core/client';
import { Config } from './core/config';
import DiscordEvent from './types/Event';
import Init from './core/init';
import mongoose from 'mongoose';
import {httpClient} from "./http/httpClient";

export const CommandList: Collection<string, Command> = new Collection<
    string,
    Command
>();
export const EventList: Collection<string, DiscordEvent> = new Collection<
    string,
    DiscordEvent
>();

Promise.all([Init.loadCommands(), Init.loadEvents()]).then(() => {
    let commands: string[] = [];

    CommandList.forEach((cmd, key) => {
        if (cmd.build() != null) commands.push(key);
    });

    console.log('Slashcommands: ', commands);
    console.log('Events: ', Array.from(EventList.keys()));

    DiscordBotClient.login(Config.BOT_TOKEN).then(async () => {
        if (!Config.MONGO_URI) {
            throw new Error('MONGO_URI has to be set!');
        }

        await mongoose.connect(Config.MONGO_URI, {ssl: true, sslValidate: Config.MONGO_DISABLE_SSL});

        console.info('Logged In!');

        httpClient.listen(Config.API_PORT, "127.0.0.1", () => {
            console.log("API listening on Port: ", Config.API_PORT)
        });

        Client.setClientActivity();
        await Client.sendOnlineMessage();
    });
});
