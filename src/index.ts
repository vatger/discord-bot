import { Collection, GatewayIntentBits, ActivityType } from 'discord.js';
import Command from './types/Command';
import Client, { DiscordBotClient } from './core/client';
import { Config } from './core/config';
import DiscordEvent from './types/Event';
import Init from './core/init';

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
        console.log('Logged In!');

        Client.setClientActivity();
        await Client.sendOnlineMessage();
    });
});
