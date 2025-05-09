import { Collection } from 'discord.js';
import Command from './types/Command';
import Client, { DiscordBotClient } from './core/client';
import { Config } from './core/config';
import DiscordEvent from './types/Event';
import Init from './core/init';
import { httpClient } from './http/httpClient';

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

        console.info('Logged In!');

        httpClient.listen(Config.API_PORT, '0.0.0.0', () => {
            console.log('API listening on Port: ', Config.API_PORT);
        });

        Client.setClientActivity();
        await Client.sendOnlineMessage();
    });
});
