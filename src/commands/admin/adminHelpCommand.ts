import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import SlashCommand from '../../types/Command';
import { adminHelpEmbed } from '../../embeds/adminHelpEmbed';

export default class HelpCommand extends SlashCommand {
    constructor() {
        super('adminhelp');
    }

    async run(interaction: CommandInteraction) {
        try {
            await interaction.reply({
                embeds: [adminHelpEmbed()],
                ephemeral: true,
            });
        } catch (error) {
            console.log(error);
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Get a list of admin commands provided by our Bot');
    }
}
