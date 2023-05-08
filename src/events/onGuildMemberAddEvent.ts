import userModel, { UserDocument } from '../models/user.model';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';
import axios from 'axios';
import vatsimApiService from '../services/vatsimApiService';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        // Register user to database

        try {
            const cid = await vatsimApiService.getCIDFromDiscordID(user.id);

            await userModel.findOneAndUpdate(
                { discordId: user.id },
                {
                    $set: {
                        cid: cid ?? null,
                    },
                },
                { upsert: true, returnOriginal: false }
            );
        } catch (e: any) {
            await sendBotLogMessage(
                'Failed to add User to Database',
                e.message
            );
        }
    }
}
