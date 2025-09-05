import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js';
import SlashCommand from '../types/Command';
import rolesService from '../services/rolesService';

export default class ContextSyncUser extends SlashCommand {
    constructor() {
        super('Sync user with VATGER');
    }

    async run(interaction: ContextMenuCommandInteraction) {
        try {
            if (!interaction.isUserContextMenuCommand()) return;
            
            const user = interaction.guild?.members.cache.get(interaction.targetUser.id)

            if (!user) {
                await interaction.reply({
                    content: 'Sync failed. User not found.',
                    ephemeral: true
                })
                return;
            }

            await rolesService.manageUserRoles(user)

            await interaction.reply({
                content: `Synced user with ID: ${user.nickname}`,
                ephemeral: true,
            });
        } catch (error) {
            await interaction.reply({
                content: 'Sync failed. Reason: ' + error,
                ephemeral: true
            })
        }
    }

    build(): any {
        return new ContextMenuCommandBuilder()
            .setName(this.name)
            .setType(ApplicationCommandType.User);

    }
}
