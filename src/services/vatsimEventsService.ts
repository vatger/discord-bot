import axios from 'axios';
import { VatsimEvent, VatsimEventAirport } from '../interfaces/vatsimEvent.interface';
import dayjs from 'dayjs';

async function getAllVatsimEvents(): Promise<VatsimEvent[]> {
    try {
        const vatsimEvents = await axios.get('https://my.vatsim.net/api/v2/events/latest');
        return vatsimEvents.data.data;
    } catch (error) {
        throw new Error(`Error on retrieving VATSIM Events:  ${error}`);
    }
}

function isGermanEvent(event: VatsimEvent) {
    return (
        event.airports.findIndex((airport: VatsimEventAirport) => {
            return airport.icao.startsWith('ED') || airport.icao.startsWith('ET');
        }) != -1
    );
}

async function getRelevantEvents(start_time: Date, end_time: Date) {
    try {
        const vatsimEvents: VatsimEvent[] = await getAllVatsimEvents();

        return vatsimEvents.filter(
            (event: VatsimEvent) =>
                dayjs(event.start_time).isAfter(start_time) && dayjs(event.end_time).isBefore(end_time) && isGermanEvent(event)
        );
    } catch (error: any) {
        throw new Error(`Failed to retrieve relevant events ${error}`);
    }
}

/**
 * Gets the list of airports associated with an event (comma separated). Returns null if no airport has been specified
 * @param event The VatsimEvent from which to extract the airports
 */
function getEventLocation(event: VatsimEvent): string | null {
    const airports: string[] = event.airports.map((airport: VatsimEventAirport) => airport.icao);

    if (airports.length == 0) return null;

    return airports.join(', ');
}

export default {
    getAllVatsimEvents,
    getRelevantEvents,
    getEventLocation,
};
