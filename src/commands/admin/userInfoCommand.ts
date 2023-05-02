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
    InteractionResponse,
} from 'discord.js';
import dayjs from 'dayjs';
import { DiscordBotClient } from '../../core/client';
import { Config } from '../../core/config';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import userModel, { UserDocument } from '../../models/user.model';
import userService from '../../services/user.service';
import { UserNote, UserWarning } from '../../interfaces/user.interface';

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
        let answer: InteractionResponse<boolean> | undefined = undefined;
        let user: User | null;
        let userInfoEmbed: EmbedBuilder | undefined = undefined;
        let actionRow: ActionRowBuilder<ButtonBuilder> | undefined = undefined;

        try {
            answer = await interaction.deferReply({ ephemeral: true });

            user = interaction.options.getUser('user');
            const guildMember: GuildMember | undefined =
                await interaction.guild?.members.fetch(
                    user?.id.toString() ?? ''
                );

            if (!user) {
                throw new Error('User not found.');
            }
            const _user: UserDocument | null = await userModel.findOne({
                discordId: user.id,
            });

            const warnings = new ButtonBuilder()
                .setCustomId('warnings')
                .setLabel(
                    `Show Warnings (${_user ? _user?.warnings.length : 'N/A'})`
                )
                .setStyle(ButtonStyle.Danger);

            const notes = new ButtonBuilder()
                .setCustomId('notes')
                .setLabel(`Show Notes (${_user ? _user?.notes.length : 'N/A'})`)
                .setStyle(ButtonStyle.Secondary);

            actionRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
                warnings,
                notes
            );

            userInfoEmbed = new EmbedBuilder()
                .setTitle(`Info for: ${user?.username}#${user?.discriminator}`)
                .setThumbnail(
                    user?.displayAvatarURL({ forceStatic: true }) ?? null
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
                        value: `${dayjs(guildMember?.user.createdAt).format(
                            'DD.MM.YYYY HH:mm'
                        )}`,
                    }
                )
                .setTimestamp()
                .setFooter({
                    text: Config.BOT_NAME,
                    iconURL: DiscordBotClient.user?.displayAvatarURL({
                        forceStatic: true,
                    }),
                });

            await interaction.followUp({
                embeds: [userInfoEmbed],
                components: [actionRow],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('UserInfo Failed', e.message)],
                ephemeral: true,
            });
            return;
        }

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;

        if (answer == null) return;

        try {
            const confirmation = await answer.awaitMessageComponent({
                filter: collectorFilter,
                time: 30000,
            });
            let embeds: EmbedBuilder[] = [];

            switch (confirmation.customId) {
                case 'warnings':
                    const _warnings: UserWarning[] =
                        (await userService.getUserWarnings(user)) ?? [];

                    for (let i = 0; i < _warnings.length; i++) {
                        embeds.push(
                            dangerEmbed(
                                `Warning #${i + 1} of ${_warnings.length}`,
                                `**Warned By:** <@${_warnings[i].authorDiscordId}>
                                 **Created at:** ${dayjs(_warnings[i].createdAt).format('DD.MM.YYYY HH:mm')}
                                 **Message:**
                                 ${_warnings[i].reason}
                                `
                            ).setTimestamp(_warnings[i].createdAt)
                        );
                    }

                    // Was passiert hier mit dem userinfo embed?
                    // Ist der dann einfach weg?
                    confirmation.update({
                        embeds: [userInfoEmbed, ...embeds],
                        components: [],
                    });

                    break;

                case 'notes':
                    const _notes: UserNote[] =
                        (await userService.getUserNotes(user)) ?? [];

                    for (let i = 0; i < _notes.length; i++) {
                        embeds.push(
                            dangerEmbed(
                                `Notes #${i + 1} of ${_notes.length}`,
                                `**Warned By:** <@${_notes[i].authorDiscordId}>
                                **Created at:** ${dayjs(_notes[i].createdAt).format('DD.MM.YYYY HH:mm')}
                                **Message:**
                                ${_notes[i].message}
                                `
                            )
                        );
                    }

                    confirmation.update({
                        embeds: [userInfoEmbed, ...embeds],
                        components: [],
                    });

                    break;
            }
        } catch (e: any) {
            await answer?.edit({
                content:
                    'Confirmation not received within 1 minute, cancelling',
                components: [],
            });
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
