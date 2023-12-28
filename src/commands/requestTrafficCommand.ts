import SlashCommand from '../types/Command';
import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    SlashCommandBuilder,
    TextChannel,
} from 'discord.js';
import axios, { AxiosResponse } from 'axios';
import { Config } from '../core/config';
import { warningEmbed } from '../embeds/default/warningEmbed';
import { dangerEmbed } from '../embeds/default/dangerEmbed';
import { DiscordBotClient } from '../core/client';

function conditionHelper(condition: string | null) {
    if (condition === null) {
        return 'No condition provided.'
    }

    switch (condition) {
        case 'good':
            return `🟢`;

        case 'medium':
            return `🟠`;

        case 'bad':
            return `🔴`;
        default:
            return 'No condition provided.';
    }
}

export default class RequestTrafficCommand extends SlashCommand {
    constructor() {
        super('requesttraffic');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            
            
            const channel = interaction.channelId;
            const textchannel = DiscordBotClient.channels.cache.get(channel) as TextChannel;
            
            const messages = await textchannel.messages.fetch();
            
            for (const message of messages) {
                if (message[1].author.id === DiscordBotClient.user?.id && message[1].interaction?.user.id === interaction.user.id) {
                    await message[1].delete();
                };
                
            }
            
            await interaction.deferReply({ ephemeral: false });
            

            const icao: string | null = interaction.options.getString('icao');

            const rwysInUse: string | null = interaction.options.getString('rwys');
            const vfrCond: string | null = interaction.options.getString('vfrcondition');
            const ifrCond: string | null = interaction.options.getString('ifrcondition');
            const remark: string | null = interaction.options.getString('remark');

            const sent = await interaction.followUp({
                embeds: [
                    warningEmbed(
                        'Working ...',
                        null,
                        `Building the request Post for ${icao?.toUpperCase() ?? 'N/A'
                        }, please wait.`
                    ),
                ],
                fetchReply: true,
                ephemeral: true,
            });

            if (icao == null) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed(
                            'Building Failed',
                            null,
                            'Failed to resolve ICAO Code'
                        ),
                    ],
                    ephemeral: true,
                });
                return;
            }

            try {
                let res: AxiosResponse = await axios.get(
                    `https://avwx.rest/api/metar/${icao}?format=json&onfail=error`,
                    {
                        headers: {
                            Authorization: `BEARER ${Config.AVWX_TOKEN}`,
                        },
                    }
                );

                const requestEmbed: EmbedBuilder = new EmbedBuilder()
                    .setColor('Grey')
                    .setTitle(`${icao.toUpperCase()} is now online and looking for traffic!`)
                    .setDescription(
                        `ATC service provided by <@${interaction.user.id}>`
                    )
                    .addFields({
                        name: 'METAR',
                        value: '```' + res?.data.raw + '```',
                    })
                    .addFields({
                        name: 'Runways in Use 🛫 🛬',
                        value: `${rwysInUse ?? 'No runways in use provided'}`,
                    })
                    .addFields({
                        name: 'VFR Conditions',
                        value: `${conditionHelper(vfrCond)}`
                    })
                    .addFields({
                        name: 'IFR Conditions',
                        value: `${conditionHelper(ifrCond)}`
                    })
                    .addFields({
                        name: 'Remarks',
                        value: `${remark ?? 'NIL'}`
                    })
                    .setTimestamp();

                await interaction.editReply({ embeds: [requestEmbed] });
            } catch (e: any) {
                await interaction.editReply({
                    embeds: [
                        dangerEmbed(
                            'Building failed',
                            null,
                            `Error creating request for ${icao.toUpperCase()}`
                        ),
                    ],
                });
            }
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('Building failed', null, 'Unknown Error')],
                ephemeral: true,
            });
            console.error(e.message);
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName('requesttraffic')
            .setDescription('Builds an airort promotion for you.')
            .addStringOption(option =>
                option
                    .setName('icao')
                    .setDescription('ICAO of the aerodrome')
                    .setRequired(true)
                    .setMaxLength(4)
                    .setMinLength(4)
            )
            .addStringOption(option =>
                option
                    .setName('rwys')
                    .setDescription('Set the runway(s) in use.')
                    .setRequired(false)
            )
            .addStringOption(option =>
                option.setName('vfrcondition')
                    .setDescription('Set the VFR condition')
                    .setRequired(false)
                    .setChoices(
                        { name: 'Good', value: 'good' },
                        { name: 'Medium', value: 'medium' },
                        { name: 'Bad', value: 'bad' }
                    ))
            .addStringOption(option =>
                option.setName('ifrcondition')
                    .setDescription('Set the IFR condition')
                    .setRequired(false)
                    .setChoices(
                        { name: 'Good', value: 'good' },
                        { name: 'Medium', value: 'medium' },
                        { name: 'Bad', value: 'bad' }
                    ))
            .addStringOption(option =>
                option
                    .setName('remark')
                    .setDescription('Set any freetext you like.')
                    .setRequired(false)
            );
    }
}
