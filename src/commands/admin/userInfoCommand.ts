import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    PresenceStatus,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
    GuildMember,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
} from 'discord.js';
import dayjs from 'dayjs';
import { DiscordBotClient } from '../../core/client';
import { Config } from '../../core/config';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';

function getPresenceFromString(status: PresenceStatus | undefined): string {
    switch (status) {
        case 'online':
            return 'Online';

        case 'idle':
            return 'Idle';

        case 'dnd':
            return 'Do Not Disturb';

        case 'invisible':
            return 'Invisible';

        case 'offline':
            return 'Offline';

        default:
            return 'Not Available';
    }
}

export default class UserInfoCommand extends SlashCommand {
    constructor() {
        super('userinfo');
    }

    async run(interaction: ChatInputCommandInteraction) {
        try {
            await interaction.deferReply({ephemeral: true});

            const user: User | null = interaction.options.getUser('user');
            const guildMember: GuildMember | undefined =
                await interaction.guild?.members.fetch(
                    user?.id.toString() ?? ''
                );

            const warnings = new ButtonBuilder()
			.setCustomId('warnings')
			.setLabel('Show Warnings')
			.setStyle(ButtonStyle.Danger);

            const notes = new ButtonBuilder()
			.setCustomId('notes')
			.setLabel('Show Notes')
			.setStyle(ButtonStyle.Secondary);

            const row = new ActionRowBuilder<ButtonBuilder>()
                    .addComponents(warnings, notes);

            await interaction.followUp({
                embeds: [
                    new EmbedBuilder()
                        .setTitle(
                            `Info for: ${user?.username}#${user?.discriminator}`
                        )
                        .setThumbnail(
                            user?.displayAvatarURL({ forceStatic: true }) ??
                                null
                        )
                        .addFields(
                            { name: 'User', value: `<@${user?.id}>` },
                            { name: 'ID', value: `${user?.id}` },
                            {
                                name: 'Highest Role',
                                value: `${guildMember?.roles.highest}`,
                            },
                            {
                                name: 'Status',
                                value: `${getPresenceFromString(
                                    guildMember?.presence?.status
                                )}`,
                            },
                            {
                                name: 'Joined Server',
                                value: `${dayjs(guildMember?.joinedAt).format(
                                    'DD.MM.YYYY HH:mm'
                                )}`,
                            },
                            {
                                name: 'Joined Discord',
                                value: `${dayjs(
                                    guildMember?.user.createdAt
                                ).format('DD.MM.YYYY HH:mm')}`,
                            }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: Config.BOT_NAME,
                            iconURL: DiscordBotClient.user?.displayAvatarURL({
                                forceStatic: true,
                            }),
                        }),
                ],
                components: [row],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('UserInfo Failed', e.message)],
                ephemeral: true,
            });
            return;
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Gets information on a specified user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User from which to query information')
                    .setRequired(true)
            );
    }
}
