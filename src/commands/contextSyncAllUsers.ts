import { ApplicationCommandType, ContextMenuCommandBuilder, ContextMenuCommandInteraction } from 'discord.js';
import SlashCommand from '../types/Command';
import { Config } from '../core/config';
import { DiscordBotClient } from '../core/client';
import vatgerApiService from '../services/vatgerApiService';
import { successEmbed } from '../embeds/default/successEmbed';
import { dangerEmbed } from '../embeds/default/dangerEmbed';

export default class ContextSyncAllUsers extends SlashCommand {
    constructor() {
        super('Sync all users with Homepage');
    }

    async run(interaction: ContextMenuCommandInteraction) {
        try {
            if (!interaction.isUserContextMenuCommand()) return;
            
            await interaction.deferReply({ ephemeral: true });

            const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);

            const discordMembersList = await guild?.members.fetch();

            if (!discordMembersList) {
                throw new Error('Failed to fetch members from Discord');
            }

            const filteredMemberList = discordMembersList.filter(
                e => !e.user.bot
            );

            let memberCount = 0;
            for (const member of filteredMemberList) {
                console.log(`Syncing member ${member[1].user.username}`);
                
                await vatgerApiService.updateVatgerUser(member[1].user.id)
               

                memberCount++;
            }
            await interaction.followUp({
                embeds: [successEmbed('Sync done', null, `Synced ${memberCount} users with VATGER.`)],
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
        return new ContextMenuCommandBuilder()
            .setName(this.name)
            .setType(ApplicationCommandType.User);

    }
}
