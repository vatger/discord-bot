import { GuildMember, Role } from "discord.js";
import { Config } from "../core/config";
import {getHomepageUser} from "./vatgerApiService";
import { getAllDiscordRolesForHp, getDiscordRolesForHpName } from '../utils/rolesMapping';

/**
 * Sync Discord roles for a user based on Vatger teams.
 * Only manages roles from getAllDiscordRolesForHp().
 */
export async function syncUserRoles(member: GuildMember, vatgerTeams: string[]) {
    const managedRoles = getAllDiscordRolesForHp(); // all roles we care about
    const managedRoleIds = new Set(managedRoles.map(r => r.id));

    // Roles the user *should* have (based on their teams)
    const desiredRoles: Role[] = vatgerTeams.flatMap(team =>
        getDiscordRolesForHpName(team)
    );

    // Deduplicate desired roles
    const desiredRoleIds = new Set(desiredRoles.map(r => r.id));

    // Current roles the user has
    const currentRoleIds = new Set(member.roles.cache.keys());

    // Roles to add: desired ∩ managed but not already present
    const toAdd = [...desiredRoleIds].filter(
        id => managedRoleIds.has(id) && !currentRoleIds.has(id)
    );

    // Roles to remove: managed ∩ currently present but not desired
    const toRemove = [...currentRoleIds].filter(
        id => managedRoleIds.has(id) && !desiredRoleIds.has(id)
    );

    // Apply changes
    if (toAdd.length > 0) {
        await member.roles.add(toAdd);
        console.log(
            `Added roles to ${member.user.tag}: ${toAdd.join(", ")}`
        );
    }

    if (toRemove.length > 0) {
        await member.roles.remove(toRemove);
        console.log(
            `Removed roles from ${member.user.tag}: ${toRemove.join(", ")}`
        );
    }
}

async function manageUserRoles(user: GuildMember) {
        const vatgerUserData = await getHomepageUser(user.id);
        if (!vatgerUserData) {
            console.error(`No Vatger User Data found for user: ${user.id}`);
            return;
        }
        
        const vatgerTeams: string[] = vatgerUserData.teams;
        const vatger_fullmember: boolean = vatgerUserData.is_vatger_fullmember;

        if (vatger_fullmember) {
            await user.roles.add(Config.VATGER_MEMBER_ROLE_ID);
            console.log(`Added VATGER Role to ${user.id}`);
        }
        else {
            await user.roles.remove(Config.VATGER_MEMBER_ROLE_ID);
            console.log(`Removed VATGER Role to ${user.id}`);
        }

        await syncUserRoles(user,vatgerTeams);

    }
    

 export default {
    manageUserRoles,
}
