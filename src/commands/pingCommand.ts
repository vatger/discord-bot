import {CommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import SlashCommand from "../types/Command";
import {BotClient} from "../core/client";
import {loadingEmbed} from "../embeds/loadingEmbed";

export default class PingCommand extends SlashCommand {
    constructor() {
        super("ping");
    }

    async run(interaction: CommandInteraction) {
        const sent = await interaction.reply({ embeds: [loadingEmbed('Random', null)], fetchReply: true, ephemeral: true });

        const pingEmbed = new EmbedBuilder()
            .setColor(0x2b3089)
            .addFields(
                {
                    name: 'Uptime  |',
                    value: `${Math.round(interaction.client.uptime / 60000)}min`,
                    inline: true,
                },
                {
                    name: 'Websocket Latency  |',
                    value: `${interaction.client.ws.ping}ms`,
                    inline: true,
                },
                {
                    name: 'Rountrip Latency  ',
                    value: `${sent.createdTimestamp - interaction.createdTimestamp}ms`,
                    inline: true,
                }
            )
            .setTimestamp()
            .setFooter({ text: BotClient.user?.username ?? 'Bot' });

        await interaction.editReply({
            embeds: [pingEmbed],
        });

    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Replies with pong!');
    }
}