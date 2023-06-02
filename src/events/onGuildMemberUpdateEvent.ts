import DiscordEvent from '../types/Event';
import {Events, GuildMember, PartialGuildMember} from 'discord.js';
import {sendBotLogMessage} from '../utils/sendBotLogMessage';
import userService from "../services/user.service";
import {Config} from "../core/config";
import { sendModeratorMessage } from '../utils/sendModeratorMessage';
import dayjs from 'dayjs';

export default class OnGuildMemberUpdateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberUpdate);
    }

    async run(oldUser: GuildMember | PartialGuildMember, newUser: GuildMember) {
        if (oldUser.pending && !newUser.pending) {
            try {
                // Add the VATSIM Member role, once the user has accepted the rules
                await newUser.roles.add(Config.REGISTERED_ROLE_ID);

                // Ask the homepage whether newUser is registered on the homepage and a member of at least one regional-group.
                await userService.checkIsVatger(newUser.id);
            } catch (e: any) {
                await sendBotLogMessage('Error in Rule-Acceptance', e.message);
            }
        }

        if (!oldUser.isCommunicationDisabled() && newUser.isCommunicationDisabled()) {
            try {
                await sendModeratorMessage('User Timeouted', [
                    {
                        name: 'User',
                        value: `<@${newUser.id}>`,
                    },
                    {
                        name: 'Timeout until',
                        value: `${dayjs(newUser.communicationDisabledUntil).format('DD.MM.YYYY HH:mm') }`,
                    }
                ]);
            } catch (e: any) {
                await sendBotLogMessage('Error in Timeout Message', e.message);
            }
        }
    }
}
