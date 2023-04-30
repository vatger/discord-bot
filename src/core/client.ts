import {
    ActivityType,
    Channel,
    Client,
    GatewayIntentBits,
    TextChannel,
} from 'discord.js';
import { Config } from './config';
import { onlineEmbed } from '../embeds/onlineEmbed';

export const DiscordBotClient = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.AutoModerationExecution,
        GatewayIntentBits.GuildModeration,
    ],
});

/**
 * Sets the client's activity
 */
function setClientActivity() {
    DiscordBotClient.user?.setActivity({
        type: ActivityType.Listening,
        name: '122.800',
        url: 'https://vatger.de',
    });
}

async function sendOnlineMessage() {
    const channel: Channel | null = await DiscordBotClient.channels.fetch(
        Config.BOT_STATUS_CHANNEL_ID
    );

    if (channel == null) {
        console.error('Bot Status Channel not found');
        return;
    }

    await (<TextChannel>channel).send({
        embeds: [onlineEmbed()],
    });
}

export default {
    setClientActivity,
    sendOnlineMessage,
};
