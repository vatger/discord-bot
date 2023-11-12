import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    PresenceStatus,
    ChatInputCommandInteraction,
    User,
    EmbedBuilder,
    GuildMember,
    InteractionResponse,
} from 'discord.js';
import dayjs from 'dayjs';
import { DiscordBotClient } from '../../core/client';
import { Config } from '../../core/config';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import userModel, { UserDocument } from '../../models/user.model';
import vatsimApiService from '../../services/vatsimApiService';
import { getAtcRatingShort } from '../../utils/vatsimUtils';

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

            const vatsimRatingData = await vatsimApiService.getRatingApi(
                _user?.cid
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
                        name: 'CID',
                        value: _user?.cid?.toString() ?? 'N/A',
                        inline: true,
                    },
                    {
                        name: 'ATC Rating',
                        value: getAtcRatingShort(vatsimRatingData?.rating),
                        inline: true,
                    },
                    {
                        name: 'Division / vACC',
                        value: `${vatsimRatingData?.division_id ?? '-'} / ${
                            vatsimRatingData?.subdivision_id ?? '-'
                        }`,
                        inline: true,
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

        } catch (e: any) {
            await answer?.edit({
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
