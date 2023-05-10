import DiscordEvent from '../types/Event';
import {Events, GuildMember, PartialGuildMember, Role} from 'discord.js';
import {sendBotLogMessage} from '../utils/sendBotLogMessage';
import userService from "../services/user.service";

export default class OnGuildMemberUpdateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberUpdate);
    }

    async run(oldUser: GuildMember | PartialGuildMember, newUser: GuildMember) {
        if (oldUser.pending && !newUser.pending) {
            try {
                // Ask the homepage whether newUser is registered on the homepage and a member of at least one regional-group.
                await userService.checkIsVatger(newUser.id);
            } catch (e: any) {
                await sendBotLogMessage('Error in Rule-Acceptance', e.message);
            }
        }
    }
}
