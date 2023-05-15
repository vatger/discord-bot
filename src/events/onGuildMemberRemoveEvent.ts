import userModel from '../models/user.model';
import DiscordEvent from '../types/Event';
import {Events, GuildMember, PartialGuildMember} from 'discord.js';
import {sendBotLogMessage} from '../utils/sendBotLogMessage';

export default class OnGuildMemberRemoveEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberRemove);
    }

    async run(user: GuildMember | PartialGuildMember) {
        // Remove user from database

        try {
            await userModel.deleteOne(
                {discordId: user.id},
            );

            await sendBotLogMessage(
                "Removed User from database (Leave)",
                `Discord ID: ${user.user.username}`
            )
        } catch (e: any) {
            await sendBotLogMessage(
                `Failed to remove user from database: ${user.id}`,
                e.message
            );
        }
    }
}
