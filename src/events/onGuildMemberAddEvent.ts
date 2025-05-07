import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import userService from '../services/user.service';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        try {
            await userService.upsertUser(user);

        } catch (e: any) {
            console.log(e);
        }
    }
}
