import { EmbedBuilder, User } from 'discord.js';
import { DiscordBotClient } from '../../core/client';
import { StaticConfig } from '../../core/config';

export const kickEmbed = (user: User, author: User, reason: string | null) =>
    new EmbedBuilder()
        .setColor('Red')
        .setTitle('User Kicked')
        .setDescription(
            `**User:** ${user.username}#${user.discriminator}\n**Kicked By:** ${
                author.username
            }#${author.discriminator}\n**Reason:** ${reason ?? 'N/A'}`
        )
        .setTimestamp(new Date())
        .setTimestamp()
        .setFooter({
            text: StaticConfig.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
