import { EmbedBuilder } from 'discord.js';
import { Config } from '../../core/config';
import { DiscordBotClient } from '../../core/client';

export const dangerEmbed = (title: string, message: string | null) =>
    new EmbedBuilder()
        .setColor('Red')
        .setTitle(title)
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
