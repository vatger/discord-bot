import { ColorResolvable, EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';

export const loadingEmbed = (
    color: ColorResolvable,
    description: string | null
) =>
    new EmbedBuilder()
        .setColor(color)
        .setTitle('Loading...')
        .setDescription(description)
        .setFooter({ text: `${DiscordBotClient.user?.username}` })
        .setTimestamp(new Date());
