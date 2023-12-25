import { Role, RoleResolvable, StringMappedInteractionTypes } from "discord.js";
import map from "./departmentRolesMap";




export async function getDepartmentRoles(teams: string[]): Promise<string[]> {
    const rolesArray: string[] = [];

    for (const role of teams) {
        if (map.has(role)) {
            rolesArray.push(map.get(role));
        }
    }

    if (teams.filter(x => x.includes('EDGG Nav' || 'EDMM Nav' || 'EDWW Nav')).length > 0) {
        rolesArray.push('1108078713507151912');
    }

    if (teams.filter(x => x.includes('EDGG Mentor' || 'EDMM Mentor' || 'EDWW Mentor')).length > 0) {
        rolesArray.push('1108078723288268960');
    }

    if (teams.filter(x => x.includes('EDGG Event' || 'EDMM Event' || 'EDWW Event')).length > 0) {
        rolesArray.push('1107301829429174365');
    }

    return rolesArray;
}