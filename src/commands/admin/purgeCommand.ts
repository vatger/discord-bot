import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    TextBasedChannel,
    ChatInputCommandInteraction,
} from 'discord.js';
import { successEmbed } from '../../embeds/default/successEmbed';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { sendModeratorMessage } from '../../utils/sendModeratorMessage';

export default class PurgeCommand extends SlashCommand {
    constructor() {
        super('purge');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply();

            const channel: TextBasedChannel | null = interaction.channel;
            const count: number | null =
                interaction.options.getInteger('count');

            if (channel == null || count == null) {
                await interaction.followUp({
                    embeds: [
                        dangerEmbed(
                            "Purge Failed",
                            'Channel or Count were provided as NULL!'
                        ),
                    ],
                    ephemeral: true,
                });
                return;
            }

            const messages = await channel.messages.fetch({ limit: count });

            // try bulk delete
            // fallback to single deletion
            try {
                await (<any>channel).bulkDelete(messages);
            } catch (e: any) {
                for (const msg of messages) {
                    const message = msg[1];
                    if (message.deletable) {
                        await message.delete();
                    }
                }
            }

            await sendModeratorMessage(
                "Purged Channel",
                `**Channel:** <#${channel.id}>
                **Purged By:** ${interaction.user.username}#${interaction.user.discriminator}`
            );

            await interaction.followUp({
                embeds: [
                    successEmbed(
                        "Purge successfull",
                        `Removing the last **${count}** message/s in <#${channel.id}>`
                    ),
                ],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed("Purge Failed", e.message)],
                ephemeral: true,
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
