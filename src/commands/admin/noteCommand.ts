import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    User,
    ChatInputCommandInteraction,
} from 'discord.js';
import userService from '../../services/user.service';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { successEmbed } from '../../embeds/default/successEmbed';
import { sendModeratorMessage } from '../../utils/sendModeratorMessage';

export default class KickCommand extends SlashCommand {
    constructor() {
        super('note');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user: User | null = interaction.options.getUser('user');
            const message: string | null =
                interaction.options.getString('message');

            if (!user) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed(
                            'Note failed',
                            'Failed to resolve User: null provided'
                        ),
                    ],
                    ephemeral: true,
                });
                return;
            }

            await userService.noteUser(interaction.user, user, message);

            await sendModeratorMessage(
                'User Note added',
                `**User:** ${user.username}#${user.discriminator}
                **Added by:** ${interaction.user.username}#${
                    interaction.user.discriminator
                }
                **Message:** ${message ?? 'N/A'}`
            );

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        'User Note added successfully',
                        `Added note for ${user.username}#${
                            user.discriminator
                        } successfully! \n\n **Message:** ${
                            message ?? 'N/A'
                        }`
                    ),
                ],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('Note failed', e.message)],
                ephemeral: true,
            });
            return;
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Add note to user')
            .addUserOption(user =>
                user
                    .setName('user')
                    .setDescription('The member to add a note to')
                    .setRequired(true)
            )
            .addStringOption(string =>
                string
                    .setName('message')
                    .setDescription('Content of note')
                    .setRequired(true)
            );
    }
}
