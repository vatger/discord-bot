import {EmbedBuilder, User} from "discord.js";

export const kickEmbed = (user: User, author: User, reason: string | null) => new EmbedBuilder()
    .setColor("Red")
    .setTitle("User Kicked")
    .setDescription(`**User:** ${user.username}#${user.discriminator}\n**Kicked By:** ${author.username}#${author.discriminator}\n**Reason:** ${reason ?? "N/A"}`)
    .setTimestamp(new Date());
