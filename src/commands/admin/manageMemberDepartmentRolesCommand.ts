import SlashCommand from '../../types/Command';
import {
    ChatInputCommandInteraction,
    InteractionResponse,
    SlashCommandBuilder,
} from 'discord.js';

import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { successEmbed } from '../../embeds/default/successEmbed';

import { manageMemberRoles } from '../../jobs/manageMemberRoles';

export default class KickCommand extends SlashCommand {
    constructor() {
        super('managedepartments');
    }

    async run(interaction: ChatInputCommandInteraction) {
        let answer: InteractionResponse<boolean> | undefined = undefined;

        try {
            answer = await interaction.deferReply({ ephemeral: true });

            await manageMemberRoles()

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        'Job done',
                        null,
                        `Went through all members!`
                    ),
                ],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('Sync failed', e.message)],
                ephemeral: true,
            });
            return;
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Sync members with their department roles');
    }
}
