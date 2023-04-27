import {ColorResolvable, EmbedBuilder} from "discord.js";

export const loadingEmbed = (color: ColorResolvable, description: string | null) => new EmbedBuilder()
    .setColor(color)
    .setTitle("Loading...")
    .setDescription(description);
