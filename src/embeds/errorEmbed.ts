import {EmbedBuilder} from "discord.js";
import {DiscordBotClient} from "../core/client";

export const errorEmbed = (message: string) => new EmbedBuilder()
    .setColor("Red")
    .setTitle("An error occurred")
    .setDescription(message)
    .setFooter({text: `${DiscordBotClient.user?.username}`})