import {EmbedBuilder} from "discord.js";
import {DiscordBotClient} from "../core/client";

export const onlineEmbed = () => new EmbedBuilder()
    .setColor("Green")
    .setTitle("Bot Started")
    .setDescription(
        `**Version: ** ${process.env.npm_package_version}`
    )
    .setFooter({text: `${DiscordBotClient.user?.username}`})
    .setTimestamp();
