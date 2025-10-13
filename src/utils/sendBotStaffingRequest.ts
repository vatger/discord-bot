import { Channel, Role, TextChannel } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { warningEmbed } from '../embeds/default/warningEmbed';
import { Config } from '../core/config';

export async function sendBotMessageInChannel(title: string, message: string, mentionRoles?: string[]) {
    try {
        const channel: Channel | undefined = DiscordBotClient.channels.cache.get(Config.STAFFING_REQUEST_CHANNEL_ID);
        if (channel == null || !channel.isTextBased() || !channel.isSendable()) {
            console.error('Failed to resolve CHANNEL! Failed to send message: ', message);
            return;
        }

        const rolesToMention: string[] = [];
        if (mentionRoles) {
            for (const mentionRole of mentionRoles) {
                let discordRole: Role | undefined = (<TextChannel>channel).guild.roles.cache.find(role => role.name === mentionRole);
                if (discordRole) {
                    rolesToMention.push('<@&' + discordRole.id + '>');
                }
            }
        }

        const _warningEmbed = warningEmbed(title, null, message);
        const textChannel: TextChannel = channel as TextChannel;
        await textChannel.send({
            content: `${rolesToMention.join(' ')}`,
            embeds: [_warningEmbed],
            flags: [4096],
        });
    } catch (error) {}
}
