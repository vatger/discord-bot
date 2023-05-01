import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { StaticConfig } from '../core/config';

export const successEmbed = (message: string, title?: string) =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle(title ?? 'Success')
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: StaticConfig.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
