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
import { errorEmbed } from '../../embeds/errorEmbed';
import { successEmbed } from '../../embeds/successEmbed';
import { DiscordBotClient } from '../../core/client';
import { banEmbed } from '../../embeds/admin/banEmbed';
import { Config } from '../../core/config';

export default class KickCommand extends SlashCommand {
    constructor() {
        super('ban');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            const user: User | null = interaction.options.getUser('user');
            const reason: string | null =
                interaction.options.getString('reason');

            if (!user) {
                await interaction.reply({
                    embeds: [
                        errorEmbed('Failed to resolve User: null provided'),
                    ],
                    ephemeral: true,
                });
                return;
            }

            const member: GuildMember | undefined =
                await interaction.guild?.members.fetch(user.id);

            if (!member) {
                await interaction.reply({
                    embeds: [
                        errorEmbed('User is no longer within this server.'),
                    ],
                    ephemeral: true,
                });
                return;
            }

            if (!member?.bannable) {
                await interaction.reply({
                    embeds: [errorEmbed('User is not bannable.')],
                    ephemeral: true,
                });
                return;
            }

            const channel: Channel | undefined =
                DiscordBotClient.channels.cache.get(
                    Config.MODERATOR_CHANNEL_ID
                );
            if (channel == null) {
                console.log(
                    'Tried to send ban message in channel, but not found! Channel-ID: ',
                    'id'
                );
                return;
            }

            await interaction.reply({
                embeds: [
                    successEmbed(
                        `User ${user.username}#${
                            user.discriminator
                        } successfully banned! \n\n **Reason:** ${
                            reason ?? 'N/A'
                        }`
                    ),
                ],
                ephemeral: true,
            });

            await member.ban({ reason: reason ?? '' });
            await (<TextChannel>channel).send({
                embeds: [banEmbed(user, interaction.user, reason)],
            });

            return;
        } catch (error) {
            await interaction.reply({
                embeds: [errorEmbed('There was an error.')],
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
