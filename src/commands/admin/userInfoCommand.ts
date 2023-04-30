import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    PresenceStatus,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
    GuildMember,
} from 'discord.js';
import { errorEmbed } from '../../embeds/errorEmbed';
import moment from 'moment';
import { DiscordBotClient } from '../../core/client';
import { StaticConfig } from '../../core/config';

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
            const user: User | null = interaction.options.getUser('user');
            const guildMember: GuildMember | undefined =
                await interaction.guild?.members.fetch(
                    user?.id.toString() ?? ''
                );

            await interaction.reply({
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
                                value: `${moment(guildMember?.joinedAt).format(
                                    'DD.MM.YYYY HH:mm'
                                )}`,
                            },
                            {
                                name: 'Joined Discord',
                                value: `${moment(
                                    guildMember?.user.createdAt
                                ).format('DD.MM.YYYY HH:mm')}`,
                            }
                        )
                        .setTimestamp()
                        .setFooter({
                            text: StaticConfig.BOT_NAME,
                            iconURL: DiscordBotClient.user?.displayAvatarURL({
                                forceStatic: true,
                            }),
                        }),
                ],
                ephemeral: true,
            });
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
            .setDescription('Gets information on a specified user')
            .addUserOption(option =>
                option
                    .setName('user')
                    .setDescription('User from which to query information')
                    .setRequired(true)
            );
    }
}
