import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    User,
    ChatInputCommandInteraction,
    GuildMember,
} from 'discord.js';
import { successEmbed } from '../../embeds/default/successEmbed';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { sendModeratorMessage } from '../../utils/sendModeratorMessage';

export default class KickCommand extends SlashCommand {
    constructor() {
        super('ban');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const user: User | null = interaction.options.getUser('user');
            const reason: string | null =
                interaction.options.getString('reason');

            if (!user) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed("Ban Failed", 'Failed to resolve User: null provided'),
                    ],
                    ephemeral: true,
                });
                return;
            }

            const member: GuildMember | undefined =
                await interaction.guild?.members.fetch(user.id);

            if (!member) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed("Ban Failed", 'User is no longer on this server.'),
                    ],
                    ephemeral: true,
                });
                return;
            }

            if (!member?.bannable) {
                await interaction.followUp({
                    embeds: [dangerEmbed("Ban Failed", 'User is not bannable.')],
                    ephemeral: true,
                });
                return;
            }

            await member.ban({ reason: reason ?? '' });

            await sendModeratorMessage(
                'User Banned',
                `**User: ** ${user.username}#${user.discriminator}
                **Banned By: ** ${interaction.user.username}#${interaction.user.discriminator}
                **Reason:** 
                \`\`\`${reason ?? 'N/A'}\`\`\`
                `
            );

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        "Ban successfull",
                        `User ${user.username}#${
                            user.discriminator
                        } successfully banned! \n\n **Reason:** ${
                            reason ?? 'N/A'
                        }`
                    ),
                ],
                ephemeral: true,
            });

            return;
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed("Ban Failed", e.message)],
                ephemeral: true,
            });
            return;
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Bans the specified user')
            .addUserOption(user =>
                user
                    .setName('user')
                    .setDescription('The member to ban')
                    .setRequired(true)
            )
            .addStringOption(string =>
                string
                    .setName('reason')
                    .setDescription('Reason of ban')
                    .setRequired(true)
            );
    }
}
