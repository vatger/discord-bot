import DiscordEvent from '../types/Event';
import { Events, GuildMember, PartialGuildMember } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';
import userService from "../services/user.service";
import { Config } from "../core/config";
export default class OnGuildMemberUpdateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberUpdate);
    }

    async run(oldUser: GuildMember | PartialGuildMember, newUser: GuildMember) {
        if (oldUser.pending && !newUser.pending) {
            try {
                // Add the VATSIM Member role, once the user has accepted the rules
                await newUser.roles.add(Config.REGISTERED_ROLE_ID);

                // Ask the homepage whether newUser is registered on the homepage.
                const isVatger = await userService.checkIsVatger(newUser.id);

                if (isVatger) {
                    await newUser.roles.add(Config.VATGER_MEMBER_ROLE_ID);
                    console.log(`Added VATGER Role to ${newUser.id}`);
                    
                    await userService.updateUser(newUser, { isVatger: true })
                }
            } catch (e: any) {
                console.error(e);
                await sendBotLogMessage('Error in Rule-Acceptance Flow', e.message);
            }
        }
    }
}
