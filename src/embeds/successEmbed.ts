import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { StaticConfig } from '../core/config';

export const successEmbed = (message: string) =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Success')
        .setDescription(message)
        .setTimestamp()
        .setFooter({
            text: StaticConfig.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
