import userModel, { UserDocument } from '../models/user.model';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        // Register user to database

        try {
            const _user: UserDocument = await userModel.findOneAndUpdate(
                { discordId: user.id }, {},
                { upsert: true, returnOriginal: false }
            );
        } catch (e: any) {
            sendBotLogMessage("Failed to add User to Database", e.message);
        }
    }
}
