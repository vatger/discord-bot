import {EmbedBuilder} from "discord.js";

export const errorEmbed = (message: string) => new EmbedBuilder()
    .setColor("Red")
    .setTitle("An error occurred")
    .setDescription(message)