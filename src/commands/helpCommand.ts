import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../types/Command';
import { helpEmbed } from '../embeds/helpEmbed';

export default class HelpCommand extends SlashCommand {
    constructor() {
        super('help');
    }

    async run(interaction: CommandInteraction) {
        try {
            await interaction.reply({
                embeds: [helpEmbed()],
                ephemeral: true,
            });
        } catch (error) {
            console.log(error);
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Get a list of commands provided by our Bot');
    }
}
