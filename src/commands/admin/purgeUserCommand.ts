import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    TextBasedChannel,
    ChatInputCommandInteraction,
} from 'discord.js';
import { errorEmbed } from '../../embeds/errorEmbed';
import { successEmbed } from '../../embeds/successEmbed';

export default class PurgeCommand extends SlashCommand {
    constructor() {
        super('purge');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            const channel: TextBasedChannel | null = interaction.channel;
            const count: number | null =
                interaction.options.getInteger('count');

            if (channel == null || count == null) {
                await interaction.reply({
                    embeds: [
                        errorEmbed(
                            'There was an error. \nChannel or Count were provided as NULL!'
                        ),
                    ],
                    ephemeral: true,
                });
                return;
            }

            await interaction.reply({
                embeds: [
                    successEmbed(
                        `Removing the last **${count}** message/s in <#${channel.id}>`
                    ),
                ],
                ephemeral: true,
            });

            // try bulk delete
            // fallback to single deletion
            try {
                await (<any>channel).bulkDelete(count);
            } catch (e: any) {
                const messages = await channel.messages.fetch({ limit: count });
                for (const msg of messages) {
                    const message = msg[1];
                    if (message.deletable) {
                        await message.delete();
                    }
                }
            }
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
