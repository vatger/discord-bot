import SlashCommand from '../../types/Command';
import {
    SlashCommandBuilder,
    ChatInputCommandInteraction,
    User,
    Role,
    EmbedBuilder,
    GuildMember,
    ActionRowBuilder,
    InteractionResponse,
    StringSelectMenuBuilder,
    Collection,
    StringSelectMenuInteraction,
} from 'discord.js';
import { Config } from '../../core/config';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { findGuildMemberByDiscordID } from '../../utils/findGuildMember';
import rolesService from '../../services/rolesService';
import { successEmbed } from '../../embeds/default/successEmbed';

export default class UserInfoCommand extends SlashCommand {
    constructor() {
        super('managememberroles');
    }

    async run(interaction: ChatInputCommandInteraction) {
        let answer: InteractionResponse<boolean> | undefined = undefined;
        let user: User | null;
        let guildMember: GuildMember | null | undefined;

        try {
            answer = await interaction.deferReply({ ephemeral: true });

            user = interaction.options.getUser('user');

            if (user == null) {
                return;
            }

            guildMember = await findGuildMemberByDiscordID(user.id);
            const roles = guildMember?.roles.cache.map((r: Role) => r.name) ?? [];

            const manageableRoleOptions = interaction.guild?.roles?.cache
                .filter((role: Role) => {
                    return Config.MANAGEABLE_GROUPS.includes(role.name);
                })
                .map((role: Role) => {
                    return {
                        label: role.name,
                        value: role.name,
                        default: roles.includes(role.name),
                    };
                });

            if (manageableRoleOptions == null) {
                throw new Error('Failed to get Guild Roles');
            }

            const manageableRoles: any = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('manageMemberRoles')
                    .setPlaceholder('You can select multiple roles')
                    .setMinValues(0)
                    .setMaxValues(manageableRoleOptions.length)
                    .addOptions(manageableRoleOptions)
            );

            await interaction.followUp({
                components: [manageableRoles],
                ephemeral: true,
            });
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('ManageMemberRoles Failed', null, e.message)],
                ephemeral: true,
            });
            return;
        }

        const collectorFilter = (i: any) => i.user.id === interaction.user.id;

        if (answer == null) return;

        try {
            const roleSelectInteraction = (await answer.awaitMessageComponent({
                filter: collectorFilter,
                time: 60000,
            })) as StringSelectMenuInteraction;

            const roles: Collection<string, Role> | undefined = interaction.guild?.roles.cache;

            if (guildMember == null || !(guildMember instanceof GuildMember)) return;

            await rolesService._addUserRoles(roleSelectInteraction, roles, guildMember);
            await rolesService._removeUserRoles(roleSelectInteraction, roles, guildMember, Config.MANAGEABLE_GROUPS);

            let newRoles: Collection<string, Role> | undefined = guildMember.roles.cache;
            newRoles = newRoles?.filter((role: Role) => {
                return Config.MANAGEABLE_GROUPS.includes(role.name);
            });

            let roleIndex = 0;
            await answer.edit({
                embeds: [
                    successEmbed(
                        'Success',
                        null,
                        newRoles?.size == 0
                            ? 'All roles removed'
                            : `Roles Updated to: ${newRoles
                                  ?.map((role: Role) => {
                                      roleIndex++;
                                      return `\n(${roleIndex}) ${role.name}`;
                                  })
                                  .join('')}`
                    ),
                ],
                components: [],
            });
        } catch (e: any) {
            await answer?.edit({
                embeds: [dangerEmbed('Failed to update', null, 'No selection recognized')],
                components: [],
            });
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Manage roles for a specified user')
            .addUserOption(option => option.setName('user').setDescription('User for role management').setRequired(true));
    }
}
