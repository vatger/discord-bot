import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';

export const adminHelpEmbed = () =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Here is a List of all available admin commands')
        .addFields([
            {
                name: '`/kick (user) (reason)`',
                value: 'Kick the selected user for given reason.',
            },
        ])
        .addFields([
            {
                name: '`/ban (user) (reason)`',
                value: 'Ban the selected user for given reason.',
            },
        ])
        .addFields([
            {
                name: '`/note (user) (message)`',
                value: 'Write a note for the user. This note will be saved in the user database.'
            },
        ])
        .addFields([
            {
                name: '`/warn (user) (reason)`',
                value: 'Warn the user for the given reason. This warning will be saved in the user database.',
            },
        ])
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
