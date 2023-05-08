import {
    CommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
} from 'discord.js';
import SlashCommand from '../types/Command';
import axios, { AxiosResponse } from 'axios';
import { dangerEmbed } from '../embeds/default/dangerEmbed';
import { successEmbed } from '../embeds/default/successEmbed';

// -20 constant for title!
const DISCORD_DESC_LIMIT = 1000 - 20;

type DatafeedController = {
    name: string;
    callsign: string;
    frequency: string;
};

export default class HelpCommand extends SlashCommand {
    constructor() {
        super('onlineatc');
    }

    async run(interaction: CommandInteraction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const res: AxiosResponse = await axios.get(
                'https://data.vatsim.net/v3/vatsim-data.json'
            );

            if (res.data?.controllers?.length == 0) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed(
                            'Online Controllers Failed',
                            null,
                            'Failed to pull data from the Datafeed'
                        ),
                    ],
                    ephemeral: true,
                });

                return;
            }

            let controllers: DatafeedController[] = res.data.controllers;
            controllers = controllers
                .filter(c => {
                    return (
                        (c.callsign.includes('ED') ||
                            c.callsign.includes('ET')) &&
                        c.frequency != '199.998'
                    );
                })
                .sort((a, b) => {
                    return a.callsign < b.callsign ? -1 : 1;
                });

            let strlen: number = 0;
            let index = 0;
            let controllerString: Array<string> = [];

            for (const c of controllers) {
                if (controllerString[index] == null) controllerString.push('');

                // EDDF_S_TWR (Max Mustermann | 119.900)
                let delta =
                    c.callsign.length + c.name.length + c.frequency.length + 12;

                if (strlen + delta < DISCORD_DESC_LIMIT) {
                    controllerString[
                        index
                    ] += `**${c.callsign}** (${c.name} | ${c.frequency})\n`;
                    strlen += delta;
                } else {
                    strlen = 0;
                    index++;
                }
            }

            let embeds: EmbedBuilder[] = [];
            for (let i = 0; i < controllerString.length; i++) {
                embeds.push(
                    successEmbed(
                        `Online ATC | ${i + 1}/${index + 1}`,
                        null,
                        controllerString[i]
                    )
                );
            }
            await interaction.followUp({
                embeds: embeds,
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [
                    dangerEmbed(
                        'Online Controllers Failed',
                        null,
                        'Unknown error'
                    ),
                ],
                ephemeral: true,
            });
            console.error(e.message);
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Get a list of online stations within the vACC');
    }
}
