import SlashCommand from '../../types/Command';
import {
    ChatInputCommandInteraction,
    SlashCommandBuilder,
    User,
} from 'discord.js';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import userService from '../../services/user.service';
import { successEmbed } from '../../embeds/default/successEmbed';
import { sendModeratorMessage } from '../../utils/sendModeratorMessage';

export default class WarnDeleteCommand extends SlashCommand {
    constructor() {
        super('warndelete');
    }

    async run(interaction: ChatInputCommandInteraction): Promise<void> {
        try {
            await interaction.deferReply({ ephemeral: true });

            const user: User | null = interaction.options.getUser('user');
            const warnId: string | null =
                interaction.options.getString('warnid');

            if (user == null || warnId == null) {
                await interaction.followUp({
                    content: 'User or WarnID undefined!',
                    ephemeral: true,
                });
                return;
            }

            // Returns the user before the deletion.
            // That way we can get the warning reason
            let _user = await userService.deleteWarn(user, warnId);
            if (_user != null) {
                await interaction.followUp({
                    embeds: [
                        successEmbed(
                            'Warning Removed',
                            null,
                            `The warning **${warnId}** was removed for user <@${user.id}>`
                        ),
                    ],
                    ephemeral: true,
                });
            } else {
                throw new Error();
            }

            await sendModeratorMessage('Warning Removed', [
                {
                    name: 'User',
                    value: `<@${user.id}>`,
                },
                {
                    name: `Removed By`,
                    value: `<@${interaction.user.id}>`,
                },
                {
                    name: 'Warning Reason',
                    value: `\`\`\`${
                        _user.warnings.find(w => w._id == warnId)?.reason ??
                        'N/A'
                    }\`\`\``,
                },
            ]);
        } catch (e: any) {
            await interaction.followUp({
                embeds: [
                    dangerEmbed('Warning Removal Failed', null, e.message),
                ],
                ephemeral: true,
            });
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Remove warning from this user')
            .addUserOption(user =>
                user
                    .setName('user')
                    .setDescription(
                        'The member to remove the warning from warn'
                    )
                    .setRequired(true)
            )
            .addStringOption(string =>
                string
                    .setName('warnid')
                    .setDescription(
                        'ID of the exact warning message to be removed'
                    )
                    .setRequired(true)
            );
    }
}
