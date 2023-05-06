import { DiscordBotClient } from "../core/client";
import { Config } from "../core/config";
import {TextChannel, Channel, JSONEncodable, APIEmbed} from "discord.js";
import { dangerEmbed } from "../embeds/default/dangerEmbed";

export async function sendModeratorMessage(title: string, message: string)
{
    const channel: Channel | undefined =
                DiscordBotClient.channels.cache.get(
                    Config.MODERATOR_CHANNEL_ID
                );
            if (channel == null) {
                console.log(
                    'Tried to send moderator message in channel, but not found! Channel-ID: ',
                    Config.MODERATOR_CHANNEL_ID
                );
                return;
            }

    await (<TextChannel>channel).send({
        embeds: [dangerEmbed(title, message)]
    });
}

export async function sendModeratorEmbed(e: APIEmbed | JSONEncodable<APIEmbed>) {
    const channel: Channel | undefined =
        DiscordBotClient.channels.cache.get(
            Config.MODERATOR_CHANNEL_ID
        );
    if (channel == null) {
        console.log(
            'Tried to send moderator message in channel, but not found! Channel-ID: ',
            Config.MODERATOR_CHANNEL_ID
        );
        return;
    }

    await (<TextChannel>channel).send({
        embeds: [e]
    });
}