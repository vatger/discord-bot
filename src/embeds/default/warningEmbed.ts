import { EmbedBuilder } from 'discord.js';
import { Config } from '../../core/config';
import { DiscordBotClient } from '../../core/client';

export const warningEmbed = (title: string, message: string) =>
    new EmbedBuilder()
        .setColor('Yellow')
        .setTitle(title)
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
