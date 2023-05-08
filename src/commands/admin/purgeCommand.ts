import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    TextBasedChannel,
    ChatInputCommandInteraction,
} from 'discord.js';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { sendModeratorMessage } from '../../utils/sendModeratorMessage';
import { warningEmbed } from '../../embeds/default/warningEmbed';

export default class PurgeCommand extends SlashCommand {
    constructor() {
        super('purge');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            const channel: TextBasedChannel | null = interaction.channel;
            const count: number | null =
                interaction.options.getInteger('count');

            const message = await interaction.reply({
                fetchReply: true,
                embeds: [
                    warningEmbed(
                        'Purging in Progress',
                        null,
                        `Deleting the last **${count}** message/s in <#${channel?.id}>`
                    ),
                ],
                ephemeral: true,
            });

            if (channel == null || count == null) {
                await message.edit({
                    embeds: [
                        dangerEmbed(
                            'Purge Failed',
                            null,
                            'Channel or Count were provided as NULL'
                        ),
                    ],
                });
                return;
            }

            const messages = await channel.messages.fetch({ limit: count });

            // try bulk delete, fallback to single deletion
            try {
                await (<any>channel).bulkDelete(messages);
            } catch (e: any) {
                for (const msg of messages) {
                    if (msg[1].deletable) {
                        await msg[1].delete();
                    }
                }
            }

            await sendModeratorMessage('Purged Channel', [
                {
                    name: 'Channel',
                    value: `<#${channel.id}>`,
                },
                {
                    name: 'Purged By',
                    value: `<@${interaction.user.id}>`,
                },
                {
                    name: 'Number of messages',
                    value: `${count}`,
                },
            ]);
        } catch (e: any) {
            await interaction.editReply({
                embeds: [dangerEmbed('Purge Failed', null, e.message ?? 'N/A')],
            });
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Deletes the last n messages in this channel')
            .addIntegerOption(option =>
                option
                    .setName('count')
                    .setDescription('Number of messages')
                    .setMinValue(1)
                    .setMaxValue(100)
                    .setRequired(true)
            );
    }
}
