import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';

export const adminHelpEmbed = () =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Here is a List of all available admin commands')
        .addFields([
            {
                name: '`/userinfo (user)`',
                value: 'Get infos for the seleceted user.',
            },
        ])
        .addFields([
            {
                name: '`/purge (number)`',
                value: 'Deletes the last n messages in this channel.',
            },
        ])
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
