import { DiscordBotClient } from "../core/client";
import { Config } from "../core/config";
import userService from "../services/user.service";
import vatsimApiService from "../services/vatsimApiService";
import vatgerApiService from "../services/vatgerApiService";
import { getDepartmentRoles } from '../utils/getDepartmentRoles';
import { GuildMember, Role, RoleResolvable } from "discord.js";
import { sendBotLogMessage } from "../utils/sendBotLogMessage";

async function removeDepartmentRoles(member: GuildMember, usersDepartmentRoles: RoleResolvable[]) {

    const assignedMemberRoles = member.roles.cache;
    //console.log('rolesArray', assignedMemberRolesArray);

    let rolesRemoveFromUser: RoleResolvable[] = [];

    for (const role of assignedMemberRoles) {
        if (Config.MANAGEABLE_GROUPS.some(r => r === role[1].name)) {

            console.log(`Role ${role[1].name} is there`);

            if (!usersDepartmentRoles.some(r => r === role[1].id)) {
                rolesRemoveFromUser.push(role[1].id);
            }
        }
    }

    console.log('ROles to remove', rolesRemoveFromUser);

    //console.log('add');
    await member.roles.remove(rolesRemoveFromUser, 'No Department Member anymore.');

    await cleanupDepartmentRoles(member);



}

async function cleanupDepartmentRoles(member: GuildMember) {

    const assignedMemberRoles = member.roles.cache;

    const assignedMemberRolesArray = Array.from(assignedMemberRoles.values());

    if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Nav' || 'EDMM Nav' || 'EDWW Nav')).length == 0) {
        await member.roles.remove('1108078713507151912');
    }
    if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Mentor' || 'EDMM Mentor' || 'EDWW Mentor')).length == 0) {
        await member.roles.remove('1108078723288268960');
    }
    if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Event' || 'EDMM Event' || 'EDWW Event')).length == 0) {
        await member.roles.remove('1107703779194834954');
    }
}


export async function manageMemberRoles() {
    try {
        const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);

        const discordMembers = await guild?.members.fetch();

        const filteredMemberList = discordMembers?.filter(
            e => !e.user.bot
        );


        if (filteredMemberList) {
            for (const member of filteredMemberList) {

                console.log('checking member', member[1].displayName);
                const userCid = await vatsimApiService.getCIDFromDiscordID(member[1].id);

                if (userCid) {
                    const vatgerApiData = await vatgerApiService.getUserDetailsFromVatger(userCid);

                    const usersDepartmentRoles = await getDepartmentRoles(vatgerApiData.teams);



                    if (vatgerApiData.is_vatger_member && !member[1].roles.cache.some(r => r.id === Config.REGISTERED_ROLE_ID)) {

                        await member[1].roles.add(Config.VATGER_MEMBER_ROLE_ID);

                        await userService.updateUser(member[1], { isVatger: true });
                        console.log(`Added VATGER Role to ${member[1].id}`);

                    } else if (!vatgerApiData.is_vatger_member) {

                        await member[1].roles.remove(Config.VATGER_MEMBER_ROLE_ID);

                        await userService.updateUser(member[1], { isVatger: false });
                        console.log(`Removed VATGER Role to ${member[1].id}`);

                    }


                    let rolesAddToUser: RoleResolvable[] = [];
                    let rolesRemoveFromUser: RoleResolvable[] = [];

                    const assignedMemberRoles = member[1].roles.cache;


                    for (const role of usersDepartmentRoles) {
                        console.log(`Checking role: ${role}`);

                        if (!assignedMemberRoles.some(r => r.id === role)) {
                            console.log(`Adding role: ${role}`);
                            rolesAddToUser.push(role);
                        }
                    }

                    for (const role of assignedMemberRoles) {
                        console.log(`Checking role: ${role[1].name}`);
                        if (Config.MANAGEABLE_GROUPS.some(r => r === role[1].name) && !usersDepartmentRoles.some(r => r === role[1].id)) {
                            console.log('remove', role[1].name);

                            rolesRemoveFromUser.push(role[1].id);
                        }
                    }



                    const assignedMemberRolesArray = Array.from(assignedMemberRoles.values());

                    // if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Nav' || 'EDMM Nav' || 'EDWW Nav')).length == 0) {
                    //     await member.roles.remove('1108078713507151912');
                    // }
                    // if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Mentor' || 'EDMM Mentor' || 'EDWW Mentor')).length == 0) {
                    //     await member.roles.remove('1108078723288268960');
                    // }
                    // if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Event' || 'EDMM Event' || 'EDWW Event')).length == 0) {
                    //     await member.roles.remove('1107703779194834954');
                    // }


                    await member[1].roles.add(rolesAddToUser, 'New Department Member');
                    await member[1].roles.remove(rolesRemoveFromUser, 'No Department Member anymore.');


                }


            }
        }
        console.log('done');
    } catch (error: any) {
        await sendBotLogMessage('Error in manageDepartmentRoles', error);
    }


}