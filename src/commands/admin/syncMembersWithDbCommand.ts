import SlashCommand from '../../types/Command';
import {ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from 'discord.js';
import userService from '../../services/user.service';
import {dangerEmbed} from '../../embeds/default/dangerEmbed';
import {successEmbed} from '../../embeds/default/successEmbed';
import {DiscordBotClient} from '../../core/client';
import {Config} from '../../core/config';
import vatsimApiService from "../../services/vatsimApiService";

export default class KickCommand extends SlashCommand {
    constructor() {
        super('syncmembers');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ephemeral: true});

            const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);

            const discordMembersList = await guild?.members.fetch();
            const dbUsers = await userService.getAllUsers();

            if (!discordMembersList || !dbUsers) {
                throw new Error('Failed to sync members');
            }
            const filteredMemberList = discordMembersList.filter(
                e => !e.user.bot
            );

            let memberExistCount = 0;
            let memberAddCount = 0;
            for (const member of filteredMemberList) {
                if (dbUsers.findIndex(
                    dbu => dbu.discordId === member[1].user.id
                ) === -1) {
                    const cid = await vatsimApiService.getCIDFromDiscordID(member[1].user.id);
                    await userService.addUser(
                        member[1].user,
                        cid
                    );
                    memberAddCount++;
                } else {
                    memberExistCount++;
                }
            }

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        'Sync done',
                        `Synced all members successfully.\nFound **${memberExistCount}**\nAdded: **${memberAddCount}**`
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
