import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    User,
    ChatInputCommandInteraction,
    Channel,
    TextChannel,
    GuildMember,
} from 'discord.js';
import { successEmbed } from '../../embeds/default/successEmbed';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { DiscordBotClient } from '../../core/client';
import { Config } from '../../core/config';
import { sendModeratorMessage } from '../../utils/sendModeratorMessage';

export default class KickCommand extends SlashCommand {
    constructor() {
        super('kick');
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
                        dangerEmbed("Kick Failed", 'Failed to resolve User: null provided'),
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
                        dangerEmbed("Kick Failed", 'User is no longer on this server.'),
                    ],
                    ephemeral: true,
                });
                return;
            }

            if (!member?.kickable) {
                await interaction.followUp({
                    embeds: [dangerEmbed("Kick Failed", 'User is not kickable.')],
                    ephemeral: true,
                });
                return;
            }

            await member.kick(reason ?? '');

            await sendModeratorMessage(
                'User Kicked', 
                `**User:** ${user.username}#${user.discriminator}
                **Kicked By:** ${interaction.user.username}#${interaction.user.discriminator}
                **Reason:** ${reason ?? 'N/A'}`
            );

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        "Kick successfull",
                        `User ${user.username}#${
                            user.discriminator
                        } successfully kicked! \n\n **Reason:** ${
                            reason ?? 'N/A'
                        }`
                    ),
                ],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed("Kick Failed", e.message)],
                ephemeral: true,
            });
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Kicks the specified user')
            .addUserOption(user =>
                user
                    .setName('user')
                    .setDescription('The member to kick')
                    .setRequired(true)
            )
            .addStringOption(string =>
                string
                    .setName('reason')
                    .setDescription('Reason of kick')
                    .setRequired(true)
            );
    }
}
