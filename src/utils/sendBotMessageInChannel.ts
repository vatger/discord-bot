import { Channel, TextBasedChannel } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { warningEmbed } from '../embeds/default/warningEmbed';

export async function sendBotMessageInChannel(title: string, message: string, channelId: string) {
    try {
        const channel: Channel | undefined =
            await DiscordBotClient.channels.cache.get(
                channelId
            );
        if (channel == null) {
            console.error(
                'Failed to resolve CHANNEL! Failed to send message: ',
                message
            );
            return;
        }

        const _warningEmbed = warningEmbed(title, null, message);

        await (<TextBasedChannel>channel).send({
            embeds: [_warningEmbed],
        });
    } catch (error) {}
}
