import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';

export const successEmbed = (message: string) =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Success')
        .setDescription(message)
        .setFooter({ text: `${DiscordBotClient.user?.username}` })
        .setTimestamp(new Date());
