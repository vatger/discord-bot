import vatgerApiService from '../services/vatgerApiService';
import vatsimApiService from '../services/vatsimApiService';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        const cid = await vatsimApiService.getCIDFromDiscordID(user.id);
        if (!cid) {
            console.log('CID not found for user: ', user.id);
            return;
        }
        await vatgerApiService.updateVatgerUser({ cid: cid, discord_id: user.id});
        
    }
}
