import {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import SlashCommand from '../types/Command';
import { DiscordBotClient } from '../core/client';
import { warningEmbed } from '../embeds/default/warningEmbed';
import { successEmbed } from '../embeds/default/successEmbed';

export default class PingCommand extends SlashCommand {
    constructor() {
        super('ping');
    }

    async run(interaction: CommandInteraction) {
        const sent = await interaction.reply({
            embeds: [
                warningEmbed(
                    'Loading',
                    null,
                    'Loading ping times, please wait.'
                ),
            ],
            fetchReply: true,
            ephemeral: true,
        });

        await interaction.editReply({
            embeds: [
                successEmbed('Ping', [
                    {
                        name: 'Uptime',
                        value: `${Math.round(
                            interaction.client.uptime / 60_000
                        )} min`,
                    },
                    {
                        name: 'Websocket Latency',
                        value: `${interaction.client.ws.ping} ms`,
                    },
                    {
                        name: 'Roundtrip Latency',
                        value: `${
                            sent.createdTimestamp - interaction.createdTimestamp
                        } ms`,
                    },
                ]),
            ],
        });
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Replies with pong!');
    }
}
