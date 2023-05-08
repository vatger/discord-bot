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
        super('warn');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user: User | null = interaction.options.getUser('user');
            const reason: string | null =
                interaction.options.getString('reason');

            if (!user) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed(
                            'Warn failed',
                            null,
                            'Failed to resolve User: null provided'
                        ),
                    ],
                    ephemeral: true,
                });
                return;
            }

            await userService.warnUser(interaction.user, user, reason);

            await sendModeratorMessage('User Warned', [
                {
                    name: 'User',
                    value: `<@${user.id}>`,
                },
                {
                    name: 'Warned By',
                    value: `<@${interaction.user.id}>`,
                },
                {
                    name: 'Reason',
                    value: `\`\`\`${reason ?? 'N/A'}\`\`\``,
                },
            ]);

            await interaction.followUp({
                embeds: [
                    successEmbed('Warned successfully', [
                        {
                            name: 'User',
                            value: `<@${user.id}>`,
                        },
                        {
                            name: 'Reason',
                            value: `\`\`\`${reason ?? 'N/A'}\`\`\``,
                        },
                    ]),
                ],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('Warn failed', null, e.message)],
                ephemeral: true,
            });
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Add warning to user')
            .addUserOption(user =>
                user
                    .setName('user')
                    .setDescription('The member to warn')
                    .setRequired(true)
            )
            .addStringOption(string =>
                string
                    .setName('reason')
                    .setDescription('Reason of warning')
                    .setRequired(true)
            );
    }
}
