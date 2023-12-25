import { DiscordBotClient } from "../core/client";
import { Config } from "../core/config";
import userService from "../services/user.service";
import vatsimApiService from "../services/vatsimApiService";
import vatgerApiService from "../services/vatgerApiService";
import { getDepartmentRoles } from '../utils/getDepartmentRoles';
import { Role, RoleResolvable } from "discord.js";
import { sendBotLogMessage } from "../utils/sendBotLogMessage";




export async function manageDepartmentRoles() {
    try {
        const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);

        const discordMembers = await guild?.members.fetch();
        const dbUsers = await userService.getAllUsers();

        const filteredMemberList = discordMembers?.filter(
            e => !e.user.bot
        );


        if (filteredMemberList) {
            for (const member of filteredMemberList) {

                console.log('check member', member[1].displayName);

                const userCid = await vatsimApiService.getCIDFromDiscordID(member[1].id);

                if (userCid) {

                    const vatgerApiData = await vatgerApiService.getUserDetailsFromVatger(userCid);
                    const userRolesToAdd = await getDepartmentRoles(vatgerApiData.teams);

                    let rolesAddToUser: RoleResolvable[] = [];
                    let rolesRemoveFromUser: RoleResolvable[] = [];

                    for (const role of userRolesToAdd) {
                        if (!member[1].roles.cache.some(r => r.id === role)) {
                            rolesAddToUser.push(role);
                        }
                    }

                    const assignedMemberRoles = member[1].roles.cache;

                    const assignedMemberRolesArray = Array.from(assignedMemberRoles.values());
                    //console.log('rolesArray', assignedMemberRolesArray);


                    for (const role of assignedMemberRolesArray) {
                        if (Config.MANAGEABLE_GROUPS.some(r => r === role.name)) {

                            if (!userRolesToAdd.some(r => r === role.id)) {
                                rolesRemoveFromUser.push(role.id);
                            }
                        }
                    }

                    console.log('ROles to add', rolesAddToUser);
                    console.log('ROles to remove', rolesRemoveFromUser);

                    //console.log('add');
                    await member[1].roles.add(rolesAddToUser);
                    await member[1].roles.remove(rolesRemoveFromUser);


                    if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Nav' || 'EDMM Nav' || 'EDWW Nav')).length == 0) {
                        await member[1].roles.remove('1108078713507151912');
                    }
                    if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Mentor' || 'EDMM Mentor' || 'EDWW Mentor')).length == 0) {
                        await member[1].roles.remove('1108078723288268960');
                    }
                    if (assignedMemberRolesArray.filter(x => x.name.includes('EDGG Event' || 'EDMM Event' || 'EDWW Event')).length == 0) {
                        await member[1].roles.remove('1107703779194834954');
                    }
                }

                const isVatger = await userService.checkIsVatger(member[1].id);

                if (isVatger) {

                    await member[1].roles.add(Config.VATGER_MEMBER_ROLE_ID);
                    console.log(`Added VATGER Role to ${member[1].id}`);

                    await userService.updateUser(member[1], { isVatger: true });

                } else {

                    await member[1].roles.remove(Config.VATGER_MEMBER_ROLE_ID);
                    console.log(`Removed VATGER Role to ${member[1].id}`);

                    await userService.updateUser(member[1], { isVatger: false });

                }


            }


        }
        console.log('done');
    } catch (error: any) {
        await sendBotLogMessage('Error in manageDepartmentRoles', error);
    }

}