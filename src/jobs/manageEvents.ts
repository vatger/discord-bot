import dayjs from 'dayjs';
import vatsimEventsService from '../services/vatsimEventsService';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import {
    Collection,
    Guild,
    GuildScheduledEvent,
    GuildScheduledEventEntityType,
    GuildScheduledEventPrivacyLevel,
    GuildScheduledEventStatus,
} from 'discord.js';
import {NodeHtmlMarkdown} from 'node-html-markdown';
import {VatsimEvent} from "../interfaces/vatsimEvent.interface";

async function manageEvents(): Promise<void> {
    try {
        const relevantEvents: VatsimEvent[] = await vatsimEventsService.getRelevantEvents(dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate());

        if (!relevantEvents) {
            return;
        }

        const guild: Guild = await DiscordBotClient.guilds.fetch(Config.GUILD_ID);
        const discordEvents: Collection<string, GuildScheduledEvent<GuildScheduledEventStatus>> = await guild.scheduledEvents.fetch();

        for (const event of discordEvents) {
            try {
                if (!relevantEvents.find(relEvent => relEvent.name === event[1].name)) {
                    await guild.scheduledEvents.delete(event[0]);
                }
            } catch (error) {
                throw new Error(`Failed to delete Event ${event[1].name}`);
            }
        }

        for (const event of relevantEvents) {
            const discordEvent = discordEvents.find(dcEvent => dcEvent.name === event.name);
            if (discordEvent == null) {
                try {
                    let dcEvent = await guild.scheduledEvents.create({
                        name: event.name,
                        scheduledStartTime: dayjs(event.start_time).toISOString(),
                        scheduledEndTime: dayjs(event.end_time).toISOString(),
                        privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                        entityType: GuildScheduledEventEntityType.External,
                        entityMetadata: {location: vatsimEventsService.getEventLocation(event) ?? event.type},
                        description:
                            NodeHtmlMarkdown.translate(event.description).length < 1000
                                ? NodeHtmlMarkdown.translate(event.description)
                                : NodeHtmlMarkdown.translate(event.short_description),
                        image: event.banner,
                    });

                    discordEvents.set(dcEvent.id, dcEvent);
                } catch (error) {
                    throw new Error(`Error on creating event: ${event.name}`);
                }
            } else {
                try {
                    await guild.scheduledEvents.edit(discordEvent, {
                        scheduledStartTime: dayjs(event.start_time).toISOString(),
                        scheduledEndTime: dayjs(event.end_time).toISOString(),
                        entityMetadata: {location: vatsimEventsService.getEventLocation(event) ?? event.type},
                        description:
                            NodeHtmlMarkdown.translate(event.description).length < 1000
                                ? NodeHtmlMarkdown.translate(event.description)
                                : NodeHtmlMarkdown.translate(event.short_description),
                        image: event.banner,
                    });
                } catch (error) {
                    throw new Error(`Error on updating event: ${event.name}`);
                }
            }
        }
    } catch (error) {
        throw new Error('Failed to manage events.');
    }
}

export default {
    manageEvents,
};
