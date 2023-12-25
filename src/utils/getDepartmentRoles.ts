import { Guild, Role, RoleResolvable, StringMappedInteractionTypes } from "discord.js";
import map from "./departmentRolesMap";




export async function getDepartmentRoles(teams: string[], guild: Guild | undefined): Promise<string[]> {
    const rolesArray: string[] = [];

    for (const role of teams) {
        if (map.has(role)) {
            rolesArray.push(map.get(role));
        }
    }

    if (teams.filter(x => x.includes('EDGG Nav' || 'EDMM Nav' || 'EDWW Nav')).length > 0) {
        const role = guild?.roles.cache.find(r => r.name === 'NAV')
        if (role) {
            rolesArray.push(role.id);
        }
    }

    if (teams.filter(x => x.includes('EDGG Mentor' || 'EDMM Mentor' || 'EDWW Mentor')).length > 0) {
        const role = guild?.roles.cache.find(r => r.name === 'Mentor')
        if (role) {
            rolesArray.push(role.id);
        }
    }

    if (teams.filter(x => x.includes('EDGG Event' || 'EDMM Event' || 'EDWW Event')).length > 0) {
        const role = guild?.roles.cache.find(r => r.name === 'Event')
        if (role) {
            rolesArray.push(role.id);
        }
    }

    return rolesArray;
}