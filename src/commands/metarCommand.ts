import SlashCommand from "../types/Command";
import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {loadingEmbed} from "../embeds/loadingEmbed";
import {errorEmbed} from "../embeds/errorEmbed";
import axios, {AxiosResponse} from "axios";
import {Config} from "../core/config";

export default class MetarCommand extends SlashCommand {
    constructor() {
        super("metar");
    }

    async run(interaction: ChatInputCommandInteraction) {
        await interaction.reply({
            embeds: [loadingEmbed('Yellow', null)],
            fetchReply: true,
            ephemeral: true
        });

        const icao: string | null = interaction.options.getString("icao");

        if (icao == null)
        {
            await interaction.reply({
                embeds: [errorEmbed("Failed to resolve ICAO: null provided")],
                ephemeral: true
            });
            return;
        }

        try {
            let res: AxiosResponse = await axios.get((
                `https://avwx.rest/api/metar/${icao}?format=json&onfail=error`
            ), {
                headers: {
                    Authorization: `BEARER ${Config.AVWX_TOKEN}`,
                }
            });

            const metarEmbed: EmbedBuilder = new EmbedBuilder()
                .setColor('Green')
                .setTitle('METAR: `' + res?.data.station + '`')
                .setDescription(`Received METAR from ${res?.data?.time?.repr}`)
                .addFields({ name: 'Raw Report', value: '```' + res?.data.raw + '```' })
                .addFields({
                    name: 'Readable Report',
                    value: `
                    **Station: ** ${res?.data.station}\n
                    **Wind: ** ${res?.data.wind_direction.repr}° @ ${res?.data.wind_speed.value} ${res?.data.units.wind_speed}\n
                    **Visibility: ** ${res?.data.visibility.value} ${res?.data.units.visibility}\n
                    **Temperature: ** ${res?.data.temperature.value} ${res?.data.units.temperature}\n
                    **Dew Point: ** ${res?.data.dewpoint.value} ${res?.data.units.temperature}\n
                    **QNH: ** ${res?.data.altimeter.value}\n
                    `,
                });

            await interaction.editReply({ embeds: [metarEmbed] });

        } catch (e: any)
        {
            await interaction.editReply({
                embeds: [errorEmbed(`Error loading METAR for ${icao.toUpperCase()}`)]
            })
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName('metar')
            .setDescription('Gets the METAR for the requested Aerodrome')
            .addStringOption(option =>
                option
                    .setName('icao')
                    .setDescription("ICAO of the requested aerodrome")
                    .setRequired(true)
                    .setMaxLength(4)
                    .setMinLength(4)
            );

    }
}