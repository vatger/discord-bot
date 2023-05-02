import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    Collection,
    GuildMember,
} from 'discord.js';
import userService from '../../services/user.service';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { successEmbed } from '../../embeds/default/successEmbed';
import { DiscordBotClient } from '../../core/client';
import { Config } from '../../core/config';
import { UserDocument } from '../../models/user.model';

export default class KickCommand extends SlashCommand {
    constructor() {
        super('syncmembers');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);

            const discordMembersList:
                | Collection<string, GuildMember>
                | undefined = await guild?.members.fetch();
            const dbUsers: UserDocument[] | undefined =
                await userService.getAllUsers();

            if (!discordMembersList || !dbUsers) {
                throw new Error('Failed to sync members');
            }
            const filterredMemberList = discordMembersList.filter(
                e => !e.user.bot
            );

            for (const member of filterredMemberList) {
                if (
                    dbUsers.findIndex(
                        dbu => dbu.discordId === member[1].user.id
                    ) === -1
                ) {
                    await userService.addUser(member[1].user);
                }
            }

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        'Sync done',
                        'Synced all members successfully'
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
            .setDescription('Sync members with database');
    }
}
