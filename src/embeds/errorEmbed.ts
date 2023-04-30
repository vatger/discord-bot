import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { StaticConfig } from '../core/config';

export const errorEmbed = (message: string) =>
    new EmbedBuilder()
        .setColor('Red')
        .setTitle('An error occurred')
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: StaticConfig.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
