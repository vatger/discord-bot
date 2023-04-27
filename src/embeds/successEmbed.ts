import {EmbedBuilder} from "discord.js";

export const successEmbed = (message: string) => new EmbedBuilder()
    .setColor("Green")
    .setTitle("Success")
    .setDescription(message)