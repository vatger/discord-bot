import userModel from '../models/user.model';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';
import vatsimApiService from '../services/vatsimApiService';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        // Register user to database

        try {
            const cid = await vatsimApiService.getCIDFromDiscordID(user.id);

            const vatsimMemberData = await vatsimApiService.getRatingApi(cid);

            await userModel.findOneAndUpdate(
                { discordId: user.id },
                {
                    $set: {
                        cid: cid ?? null,
                        pilotRating: vatsimMemberData?.pilotrating ?? null,
                        controllerRating: vatsimMemberData?.rating ?? null,
                        militaryRating: vatsimMemberData?.militaryrating ?? null
                    },
                },
                {upsert: true}
            );
        } catch (e: any) {
            await sendBotLogMessage(
                'Failed to add User to Database',
                e.message
            );
        }
    }
}
