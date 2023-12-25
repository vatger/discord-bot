import { DiscordBotClient } from "../core/client";
import { Config } from "../core/config";
import userService from "../services/user.service";
import vatsimApiService from "../services/vatsimApiService";
import vatgerApiService from "../services/vatgerApiService";
import { getDepartmentRoles } from '../utils/getDepartmentRoles';
import { Guild, GuildMember, Role, RoleResolvable } from "discord.js";
import { sendBotLogMessage } from "../utils/sendBotLogMessage";

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

                    const usersDepartmentRoles = await getDepartmentRoles(vatgerApiData.teams, guild);



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

                        let assignedMemberRoles = member[1].roles.cache;


                        for (const role of usersDepartmentRoles) {

                            if (!assignedMemberRoles.some(r => r.id === role)) {
                                console.log(`Adding role: ${role} to ${member[1].displayName}`);
                                rolesAddToUser.push(role);
                            }
                        }

                        await member[1].roles.add(rolesAddToUser, 'New Department Member');

                        for (const role of assignedMemberRoles) {
                            if ((Config.MANAGEABLE_GROUPS.indexOf(role[1].name) > -1) && (usersDepartmentRoles.indexOf(role[1].id) === -1)) {
                                console.log(`Removing ${role[1].name} from ${member[1].displayName}`);

                                rolesRemoveFromUser.push(role[1].id);
                            }
                        }


                        await member[1].roles.remove(rolesRemoveFromUser, 'No Department Member anymore.');

                        assignedMemberRoles = member[1].roles.cache;

                        const assignedMemberRolesArray = Array.from(assignedMemberRoles.values());

                        if (assignedMemberRolesArray.filter(x => x.name.includes('NAV EDGG' || 'NAV EDMM' || 'NAV EDWW')).length == 0) {
                            const role = guild?.roles.cache.find(r => r.name === 'NAV')
                            if (role) {
                                await member[1].roles.remove(role);
                            }
                        }
                        if (assignedMemberRolesArray.filter(x => x.name.includes('Mentor EDGG' || 'Mentor EDMM' || 'Mentor EDWW')).length == 0) {
                            const role = guild?.roles.cache.find(r => r.name === 'Mentor')
                            if (role) {
                                await member[1].roles.remove(role);
                            }
                        }
                        if (assignedMemberRolesArray.filter(x => x.name.includes('Event EDGG' || 'Event EDMM' || 'Event EDWW')).length == 0) {
                            const role = guild?.roles.cache.find(r => r.name === 'Event')
                            if (role) {
                                await member[1].roles.remove(role); 
                            }
                        }
                    

                }


            }
        }
        console.log('done');
    } catch (error: any) {
        await sendBotLogMessage('Error in manageDepartmentRoles', error);
    }


}