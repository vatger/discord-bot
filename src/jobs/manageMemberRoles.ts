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

                const userCid = await vatsimApiService.getCIDFromDiscordID(member[1].id);

                if (userCid && !member[1].pending) {
                    const vatgerApiData = await vatgerApiService.getUserDetailsFromVatger(userCid);                 

                    if (vatgerApiData.is_vatger_member && !member[1].roles.cache.some(r => r.id === Config.VATGER_MEMBER_ROLE_ID)) {

                        await member[1].roles.add(Config.VATGER_MEMBER_ROLE_ID, 'User is VATGER Member');

                        await userService.updateUser(member[1], { isVatger: true });
                        console.log(`Added VATGER Role to ${member[1].displayName}`);

                    } else if (!vatgerApiData.is_vatger_member && member[1].roles.cache.some(r => r.id === Config.VATGER_MEMBER_ROLE_ID)) {

                        await member[1].roles.remove(Config.VATGER_MEMBER_ROLE_ID, 'User is no VATGER Member');

                        await userService.updateUser(member[1], { isVatger: false });
                        console.log(`Removed VATGER Role to ${member[1].displayName}`);

                    }       

                }


            }
        }
        console.log('done');
    } catch (error: any) {
        await sendBotLogMessage('Error in manageDepartmentRoles', error);
    }


}