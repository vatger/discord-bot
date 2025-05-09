import DiscordEvent from '../types/Event';
import { Events, GuildMember, PartialGuildMember } from 'discord.js';
import { Config } from "../core/config";
import rolesService from '../services/rolesService';
export default class OnGuildMemberUpdateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberUpdate);
    }

    async run(oldUser: GuildMember | PartialGuildMember, newUser: GuildMember) {
        if (oldUser.pending && !newUser.pending) {
            
            // Add the VATSIM Member role, once the user has accepted the rules
            await newUser.roles.add(Config.REGISTERED_ROLE_ID);

            // Ask the homepage whether newUser is registered on the homepage.
            await rolesService.manageUserRoles(newUser)
            }
        }
    }
