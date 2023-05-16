import { Collection, GuildMember, Role, StringSelectMenuInteraction } from "discord.js";

/**
 * Adds the requested roles to the user
 * @param interaction
 * @param roles
 * @param member
 */
async function _addUserRoles(
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
async function _removeUserRoles(
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


 export default {
    _addUserRoles,
    _removeUserRoles

}
