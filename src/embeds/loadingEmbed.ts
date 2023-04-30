import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { StaticConfig } from '../core/config';

export const loadingEmbed = (
    color: ColorResolvable,
    description: string | null
) =>
    new EmbedBuilder()
        .setColor(color)
        .setTitle('Loading...')
        .setDescription(description)
        .setTimestamp()
        .setFooter({
            text: StaticConfig.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
