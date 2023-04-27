import {EmbedBuilder, User} from "discord.js";

export const banEmbed = (user: User, author: User, reason: string | null) => new EmbedBuilder()
    .setColor("Red")
    .setTitle("User Banned")
    .setDescription(`**User:** ${user.username}#${user.discriminator}\n**Banned By:** ${author.username}#${author.discriminator}\n**Reason:** ${reason ?? "N/A"}`)
    .setTimestamp(new Date());
