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

        console.log(user.user.username, user.id);
        

        try {
            await userModel.updateOne({
                discordId: user.id
            }, {
                isVatger: false
            });

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
