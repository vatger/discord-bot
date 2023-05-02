import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import DiscordEvent from '../types/Event';
import { Events, GuildMember, PartialGuildMember, Role } from 'discord.js';

export default class OnGuildMemberUpdateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberUpdate);
    }

    async run(oldUser: GuildMember | PartialGuildMember, newUser: GuildMember) {
        if (oldUser.pending && !newUser.pending) {
            // Ask the homepage whether newuser.discord_id is registered on the homepage.

            const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);
            if (guild == null) {
                return;
            }

            const role = guild.roles.cache.find(
                (role: Role) => role.id == Config.REGISTERED_ROLE_ID
            );
            if (role == null) {
                return;
            }

            await newUser.roles.add(role);
        }
    }
}
