import { APIEmbedField, EmbedBuilder, RestOrArray } from 'discord.js';
import { Config } from '../../core/config';
import { DiscordBotClient } from '../../core/client';

export const dangerEmbed = (
    title: string,
    fields: RestOrArray<APIEmbedField> | null,
    description?: string
) =>
    new EmbedBuilder()
        .setColor('Red')
        .setTitle(title)
        .setDescription(description ?? null)
        .setFields(...(fields ?? []))
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
