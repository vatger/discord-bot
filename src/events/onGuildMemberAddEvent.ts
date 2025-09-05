import vatgerApiService from '../services/vatgerApiService';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import { sleep } from '../utils/sleep';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        await vatgerApiService.pushDiscordUser(user.id);
        await sleep(5000);
    }
}
