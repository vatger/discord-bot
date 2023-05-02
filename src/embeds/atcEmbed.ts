import { ColorResolvable, EmbedBuilder, EmbedFooterOptions } from 'discord.js';
import { Config } from '../core/config';
import { DiscordBotClient } from '../core/client';

export const atcEmbed = (
    color: ColorResolvable,
    title: string | null,
    description: string | null,
    footer: EmbedFooterOptions | null,
    timestamp: number | Date | null | undefined
) =>
    new EmbedBuilder()
        .setColor(color)
        .setTitle(title)
        .setDescription(description)
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
