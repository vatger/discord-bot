import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        
    }
}
