import { Role } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import file from '../configs/roleMappings.json';


export function findDiscordRole(roleQuery: string): Role | null {
    const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);
    // case-insensitive
    const byName = guild?.roles.cache.find(
        (r) => r.name.toLowerCase() === roleQuery.toLowerCase()
    );
    return byName ?? null;
}

interface RoleMapping {
    hp_name: string;
    discord_names: string[];
}

function loadConfig(): RoleMapping[] {
    try {
        return file as RoleMapping[];
    } catch (error) {
        throw new Error(`Error on loading config: ${error}`)
    }
}

export function getDiscordRolesForHpName(hpName: string): Role[] {
    const data: RoleMapping[] = loadConfig();
    const entry = data.find(
        (e) => e.hp_name.toLowerCase() === hpName.toLowerCase()
    );
    return entry?.discord_names.map(findDiscordRole).filter((r): r is Role => r !== null) ?? [];
}

export function getAllDiscordRolesForHp(): Role[] {
    const data: RoleMapping[] = loadConfig();
    const allRoles: Role[] = data.flatMap(entry =>
        entry.discord_names
            .map(findDiscordRole)
            .filter((r): r is Role => r !== null)
    );

    // Deduplicate by role ID
    return Array.from(
        new Map(allRoles.map(role => [role.id, role])).values()
    );
}
