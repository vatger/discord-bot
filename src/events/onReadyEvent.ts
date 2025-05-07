import DiscordEvent from '../types/Event';
import { Client, Events, TextChannel } from 'discord.js';
import { Config } from '../core/config';
import { rulesEmbeds } from '../embeds/ruleEmbed';
import { registrationHelpEmbed } from '../embeds/registrationHelpEmbed';
import cleanupChannels from '../jobs/cleanupChannels';
import schedule from 'node-schedule';
import manageEvents from '../jobs/manageEvents';
import { loadConfig } from '../jobs/staffingRequest/util';
import staffingRequest from '../jobs/staffingRequest/staffingRequest';
import { manageMemberRoles } from '../jobs/manageMemberRoles';

export default class OnReadyEvent extends DiscordEvent {
    constructor() {
        super(Events.ClientReady);
    }

    async run(client: Client) {
        if (Config.UPDATE_RULES === 'true') {
            const channelId = Config.WELCOME_CHANNEL_ID;
            const channel: TextChannel = client.channels.cache.get(channelId) as TextChannel;

            if (channel == null) return;

            const messages = await channel.messages.fetch({ limit: 50 });

            for (const message of messages) {
                await message[1].delete();
            }

            await channel.send({
                files: ['http://hp.vatsim-germany.org/images/vacc_logo_white.png'],
            });

            await channel.send({
                embeds: rulesEmbeds,
            });
        }

        if (Config.UPDATE_REGISTRATION_HELP === 'true') {
            const channelId = Config.REGISTRATION_HELP_CHANNEL_ID;
            const channel: TextChannel = client.channels.cache.get(channelId) as TextChannel;

            if (channel == null) return;

            const messages = await channel.messages.fetch({ limit: 50 });

            for (const message of messages) {
                await message[1].delete();
            }

            await channel.send({
                embeds: [registrationHelpEmbed],
            });
        }

        setInterval(cleanupChannels.cleanupChannels, 60000 * 60);

        schedule.scheduleJob('0 2 * * *', async () => {
            await manageMemberRoles();
        });

        if (Config.EVENT_UPDATE) {
            await manageEvents.manageEvents();

            schedule.scheduleJob(Config.EVENT_UPDATE_CRON, async () => {
                await manageEvents.manageEvents();
            });
        }

        if (Config.STAFFING_REQUEST) {
            const alertCooldown: Record<string, number> = {};
            const config = await loadConfig();

            setInterval(async () => {
                await staffingRequest.checkStaffingAlerts(config, alertCooldown);
            }, 15 * 1000 * 60);
        }
    }
}
