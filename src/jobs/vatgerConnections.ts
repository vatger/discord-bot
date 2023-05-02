import axios from 'axios';
import { ColorResolvable, EmbedFooterOptions, TextChannel } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import { DatafeedController } from '../interfaces/dataFeedController.interface';
import { atcEmbed } from '../embeds/atcEmbed';

let controllers: DatafeedController[] = [];

async function getControllersFromDatafeed() {
    try {
        const datafeed = await axios.get(Config.VATSIM_DATAFEED_URL);
        let controllers = datafeed.data?.controllers ?? [];

        controllers = controllers.filter((controller: DatafeedController) => {
            return (
                controller.facility != 0 &&
                controller.frequency != '199.998' &&
                (controller.callsign.startsWith('ED') ||
                    controller.callsign.startsWith('ET'))
            );
        });

        return controllers;
    } catch (error) {
        console.log(error);
    }
}

async function initialize() {
    controllers = await getControllersFromDatafeed();
}

async function checkVatgerConnections() {
    let actualControllers: DatafeedController[] =
        await getControllersFromDatafeed();

    await removeControllers(actualControllers);

    for (const actualController of actualControllers) {
        if (
            !controllers.some(
                controller => controller.callsign === actualController.callsign
            )
        ) {
            controllers.push(actualController);
            await sendChannelNotification(
                'Green',
                'New ATC Connection',
                `**${actualController.callsign} (${actualController.name})** is now online on frequency ${actualController.frequency}!`,
                null,
                new Date(actualController.logon_time)
            );
        }
    }

    controllers = actualControllers;
}

async function removeControllers(actualControllers: DatafeedController[]) {
    for (const controller of controllers) {
        if (
            actualControllers.findIndex(
                item => item.callsign === controller.callsign
            ) === -1
        ) {
            await sendChannelNotification(
                'Red',
                'ATC Connection Terminated',
                `**${controller.callsign} (${controller.name})** went offline`,
                null,
                new Date()
            );
        }
    }
}

async function sendChannelNotification(
    color: ColorResolvable,
    title: string | null,
    description: string | null,
    footer: EmbedFooterOptions | null,
    timestamp: number | Date | null
) {
    try {
        const channelId = Config.ATC_NOTIFY_CHANNEL_ID;
        const channel: TextChannel = DiscordBotClient.channels.cache.get(
            channelId
        ) as TextChannel;

        await channel.send({
            embeds: [atcEmbed(color, title, description, footer, timestamp)],
        });
    } catch (error) {
        console.log(error);
    }
}

export default {
    initialize,
    checkVatgerConnections,
};
