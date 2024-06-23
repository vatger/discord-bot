import userModel from '../models/user.model';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';
import vatsimApiService from '../services/vatsimApiService';
import userService from '../services/user.service';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        // Register user to database

        try {
            const cid = await vatsimApiService.getCIDFromDiscordID(user.id);

            //const vatsimMemberData = await vatsimApiService.getRatingApi(cid);

            await userService.addUser(user, cid);

        } catch (e: any) {
            console.log(e);
        }
    }
}
