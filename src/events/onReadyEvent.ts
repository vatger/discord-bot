import DiscordEvent from '../types/Event';
import { Client, Events, TextChannel } from 'discord.js';
import { Config } from '../core/config';
import { rulesEmbeds } from '../embeds/ruleEmbed';
import vatgerConnections from '../jobs/vatgerConnections';

export default class OnReadyEvent extends DiscordEvent {
    constructor() {
        super(Events.ClientReady);
    }

    async run(client: Client) {
        if (Config.UPDATE_RULES === 'true') {
            const channelId = Config.WELCOME_CHANNEL_ID;
            const channel: TextChannel = client.channels.cache.get(
                channelId
            ) as TextChannel;

            if (channel == null) return;

            const messages = await channel.messages.fetch({ limit: 50 });

            for (const message of messages) {
                await message[1].delete();
            }

            await channel.send({
                files: [
                    'http://hp.vatsim-germany.org/images/vacc_logo_white.png',
                ],
            });

            await channel.send({
                embeds: rulesEmbeds,
            });
        }

        setInterval(vatgerConnections.checkVatgerConnections, 60000);
    }
}
