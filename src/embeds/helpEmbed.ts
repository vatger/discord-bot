import {EmbedBuilder} from "discord.js";
import {DiscordBotClient} from "../core/client";

export const helpEmbed = () => new EmbedBuilder()
    .setColor('Green')
    .setTitle('Here is a List of all available commands')
    .addFields([
        {
            name: '`/metar`',
            value: 'Retrieve METAR for a specific Aerodrome.',
        },
    ])
    .addFields([
        {
            name: '`/atis`',
            value: 'Retrieve ATIS for a specific Aerodrome.',
        },
    ])
    .addFields([
        {
            name: '`/roleselection`',
            value: 'Select roles to see the respective regional group channel',
        },
    ])
    .setFooter({text: `${DiscordBotClient.user?.username}`})
    .setTimestamp();

