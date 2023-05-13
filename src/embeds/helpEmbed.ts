import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';

export const helpEmbed = () =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Here is a List of all available commands')
        .addFields([
            {
                name: '`/metar`',
                value: 'Retrieve METAR for a specific Aerodrome.',
            },
        ])
        .addFields([
            {
                name: '`/atis`',
                value: 'Retrieve ATIS for a specific Aerodrome.',
            },
        ])
        .addFields([
            {
                name: '`/roleselection`',
                value: 'Select roles to get notifications for.',
            },
        ])
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
