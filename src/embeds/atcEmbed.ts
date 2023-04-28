import { ColorResolvable, EmbedBuilder, EmbedFooterOptions } from 'discord.js';

export const atcEmbed = (
    color: ColorResolvable,
    title: string | null,
    description: string | null,
    footer: EmbedFooterOptions | null,
    timestamp: number | Date | null | undefined
) => new EmbedBuilder().setColor(color).setTitle(title).setDescription(description).setFooter(footer).setTimestamp(timestamp);
