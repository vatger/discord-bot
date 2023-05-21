import axios from 'axios';
import { vatsimEvent } from '../interfaces/vatsimEvent.interface';
import dayjs from 'dayjs';

async function getAllVatsimEvents (): Promise<vatsimEvent[]> {
    try {
        console.log('Get events');
        
        const vatsimEvents = await axios.get('https://my.vatsim.net/api/v1/events/all');        

        return vatsimEvents.data.data;

    } catch (error) {
        throw new Error('Error on retrieving VATSIM Events');
    }
    
}

function isGermanEvent(event: vatsimEvent) {

    return event.airports.findIndex((airport) => {return airport.icao.startsWith('ED') || airport.icao.startsWith('ET')}) != -1;

}

async function getRelevantEvents(start_time: Date, end_time: Date) {
    try {
        
        const vatsimEvents: vatsimEvent[] = await getAllVatsimEvents();

        const relevantEvents = vatsimEvents.filter(event => dayjs(event.start_time).isAfter(start_time) && dayjs(event.end_time).isBefore(end_time) && isGermanEvent(event) );
        
        console.log('relevant', relevantEvents);
        
        return relevantEvents;

    } catch (error) {
        
    }
    
}




export default {
    getAllVatsimEvents,
    getRelevantEvents
}