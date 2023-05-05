import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import userModel, { UserDocument } from '../models/user.model';
import DiscordEvent from '../types/Event';
import { Events, GuildMember, PartialGuildMember, Role } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';

export default class OnGuildMemberUpdateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberUpdate);
    }

    async run(oldUser: GuildMember | PartialGuildMember, newUser: GuildMember) {

        if (oldUser.pending && !newUser.pending) {
            // Ask the homepage whether newuser.discord_id is registered on the homepage.
            try {
                const guild = DiscordBotClient.guilds.cache.get(
                    Config.GUILD_ID
                );
                if (guild == null) {
                    return;
                }

                const role = guild.roles.cache.find(
                    (role: Role) => role.id == Config.REGISTERED_ROLE_ID
                );
                if (role == null) {
                    return;
                }

                await userModel.findOneAndUpdate(
                    { discordId: newUser.id },
                    {},
                    { upsert: true }
                );

                await newUser.roles.add(role);
            } catch (e: any) {
                sendBotLogMessage('Failed to add User to Database', e.message);
            }
        }
    }
}
