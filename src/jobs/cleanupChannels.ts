import { TextChannel } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import dayjs from 'dayjs';

function parseChannels() {
    const channelArray = Config.CLEANUP_CHANNEL_IDS.split(',');
    return channelArray;
}

async function cleanupChannels() {
    try {
        const channelIdArray = parseChannels();

        for (const channelId of channelIdArray) {
            const channel: TextChannel = DiscordBotClient.channels.cache.get(
                channelId
            ) as TextChannel;
            const regex = new RegExp(
                '(?<=Nachrichten werden nach ).*(?= Stunde)',
                'gm'
            );

            if (!channel || !channel.topic) {
                continue;
            }

            const match: string[] | null = channel.topic.match(regex);

            if (!match) {
                continue;
            }

            const hoursToDelete = Number(channel.topic.match(regex));

            const messages = await channel.messages.fetch({ limit: 50 });

            for (const message of messages) {
                if (
                    dayjs(new Date()).diff(message[1].createdAt, 'hour', true) >
                    hoursToDelete
                ) {
                    console.log('delete message');

                    await message[1].delete();
                }
            }
        }
    } catch (error) {}
}

export default {
    cleanupChannels,
};
