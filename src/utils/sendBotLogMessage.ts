import { Channel, TextChannel } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import { dangerEmbed } from '../embeds/default/dangerEmbed';

export async function sendBotLogMessage(title: string, message: string) {
    try {
        const logChannel: Channel | undefined = DiscordBotClient.channels.cache.get(Config.BOT_STATUS_CHANNEL_ID);
        if (logChannel == null || !logChannel.isTextBased() || !logChannel.isSendable()) {
            console.error('Failed to resolve LOG_CHANNEL! Failed to send message: ', message);
            return;
        }
        const _errorEmbed = dangerEmbed(title, null, message);
        const textChannel: TextChannel = logChannel as TextChannel;
        await textChannel.send({ embeds: [_errorEmbed] });
    } catch (error) {}
}
