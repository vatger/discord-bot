import SlashCommand from '../../types/Command';
import {
    StringSelectMenuInteraction,
    GuildMember,
    APIInteractionGuildMember,
    EmbedBuilder,
    Role,
    Collection,
} from 'discord.js';
import { Config } from '../../core/config';

export default class SelectFirStringSelection extends SlashCommand {
    constructor() {
        super('selectFir');
    }

    async run(interaction: StringSelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const member: GuildMember | APIInteractionGuildMember | null =
            interaction.member;
        const roles: Collection<string, Role> | undefined =
            interaction.guild?.roles.cache;

        if (member == null || !(member instanceof GuildMember)) return;

        await this._addUserRoles(interaction, roles, member);
        await this._removeUserRoles(
            interaction,
            roles,
            member,
            Config.RG_GROUPS
        );

        let newRoles: Collection<string, Role> | undefined = member.roles.cache;
        newRoles = newRoles?.filter((role: Role) => {
            return Config.RG_GROUPS.includes(role.name);
        });

        let roleIndex = 0;
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Success')
                    .setDescription(
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
            ephemeral: true,
        });
    }

    /**
     * Adds the requested roles to the user
     * @param interaction
     * @param roles
     * @param member
     */
    async _addUserRoles(
        interaction: StringSelectMenuInteraction,
        roles: Collection<string, Role> | undefined,
        member: GuildMember
    ) {
        let rolesToAdd: Role[] = [];
        for (const i_action of interaction.values) {
            const role = roles?.find(role => role.name == i_action);
            if (role) rolesToAdd.push(role);
        }

        await member.roles.add(rolesToAdd);
    }

    /**
     * Removes the unused roles from a user
     * @param interaction
     * @param roles
     * @param member
     * @param rgGroups
     */
    async _removeUserRoles(
        interaction: StringSelectMenuInteraction,
        roles: Collection<string, Role> | undefined,
        member: GuildMember,
        rgGroups: string[]
    ) {
        let rolesToRemove: Role[] = [];
        for (const rg of rgGroups) {
            const assignedRoles = member.roles.cache;
            if (
                !interaction.values.includes(rg) &&
                assignedRoles.find((role: Role) => role.name == rg) != null
            ) {
                const role: Role | undefined = assignedRoles.find(
                    (role: Role) => role.name == rg
                );
                if (role) rolesToRemove.push(role);
            }
        }

        await member.roles.remove(rolesToRemove);
    }
}
