import { EmbedBuilder, User } from 'discord.js';
import { DiscordBotClient } from '../../core/client';

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
        .setFooter({ text: `${DiscordBotClient.user?.username}` })
        .setTimestamp();
