import { Collection, GuildMember, Role, StringSelectMenuInteraction, User } from "discord.js";
import { DiscordBotClient } from "../core/client";
import { Config } from "../core/config";
import vatsimApiService from "./vatsimApiService";
import vatgerApiService from "./vatgerApiService";
import { findGuildMemberByDiscordID } from "../utils/findGuildMember";
import map from "../utils/departmentRolesMap";

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

async function manageUserRoles(user: GuildMember) {
        const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);
        const cid: number | undefined = await vatsimApiService.getCIDFromDiscordID(user.id);

        if (!cid) {
            throw new Error('Failed to get CID for User ' + user.nickname)
        }
        const vatgerUserData = await vatgerApiService.getUserDetailsFromVatger(cid);
        
        const teams: string[] = vatgerUserData.teams;
        const vatger_fullmember: boolean = vatgerUserData.is_vatger_fullmember;
        
        console.log(`Homepage Request for User: ${cid}. Teams: ${teams}`);
        
        
        //const guildMember: GuildMember | undefined = await findGuildMemberByDiscordID(user.id);
        let guildMemberRoles = user.roles.cache;
        
        
        if (vatger_fullmember) {
            await user.roles.add(Config.VATGER_MEMBER_ROLE_ID);
            console.log(`Added VATGER Role to ${user.id}`);
        }
        
        for (const group of Config.MANAGEABLE_GROUPS) {
            if (map.has(group)) {
                if (teams.includes(group) && !guildMemberRoles?.some(r => r.id === map.get(group))) {
                    await user.roles.add(map.get(group));
                } else if (!teams.includes(group) && guildMemberRoles?.some(r => r.id === map.get(group))) {
                    await user.roles.remove(map.get(group));
                }
            }
        }
        
        guildMemberRoles = user.roles.cache;
        const roleNamesArray: string[] = [];
        
        if (guildMemberRoles) {
            for (const role of guildMemberRoles) {
                roleNamesArray.push(role[1].name);
            }
        }
        
        const guildRoles: Collection<string, Role> | undefined = guild?.roles.cache;
        
        const navRole = guildRoles?.filter(r => r.name === 'Nav');
        const mentorRole = guildRoles?.filter(r => r.name === 'Mentor');
        const eventRole = guildRoles?.filter(r => r.name === 'Event');      
        
        if (navRole) {
            if (roleNamesArray.filter(x => ['EDGG Nav','EDMM Nav','EDWW Nav'].includes(x)).length > 0) {
                await user.roles.add(navRole)
            } else {
                await user.roles.remove(navRole)
            }
        }
        if (mentorRole) {
            if (roleNamesArray.filter(x => ['EDGG Mentor','EDMM Mentor','EDWW Mentor', 'S1 Mentor'].includes(x)).length > 0) {
                await user.roles.add(mentorRole);
            } else {
                await user.roles.remove(mentorRole);
            }
        }
        if (eventRole) {
            if (roleNamesArray.filter(x => ['EDGG Event','EDMM Event','EDWW Event'].includes(x)).length > 0) {
                await user.roles.add(eventRole)
            } else {
                await user.roles.remove(eventRole)
            }
        }
        
    }
    

 export default {
    manageUserRoles,
    _addUserRoles,
    _removeUserRoles

}
