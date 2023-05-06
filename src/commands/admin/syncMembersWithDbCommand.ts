import SlashCommand from '../../types/Command';
import {ChatInputCommandInteraction, PermissionFlagsBits, SlashCommandBuilder} from 'discord.js';
import userService from '../../services/user.service';
import {dangerEmbed} from '../../embeds/default/dangerEmbed';
import {successEmbed} from '../../embeds/default/successEmbed';
import {DiscordBotClient} from '../../core/client';
import {Config} from '../../core/config';
import vatsimApiService from "../../services/vatsimApiService";
import userModel from "../../models/user.model";

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

            let memberCount = 0;
            for (const member of filteredMemberList) {
                // This queries the VATSIM API for every member, not optimal, but it is what it is
                const cid = await vatsimApiService.getCIDFromDiscordID(member[1].user.id);

                await userModel.findOneAndUpdate({
                    discordId: member[1].user.id,
                }, {
                    $set: {
                        cid: cid,
                    }
                }, {upsert: true});

                memberCount++;
            }

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        'Sync done',
                        `Synced all members successfully.\nTotal: **${memberCount}**`
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
