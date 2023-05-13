import axios from 'axios';
import { DatafeedAtis } from '../interfaces/dataFeedAtis.interface';

async function getRawDataFeed() {
    try {
        const response = await axios.get(
            'https://data.vatsim.net/v3/vatsim-data.json'
        );

        return response.data;
    } catch (error) {
        throw error;
    }
}

async function getAtis(
    icao: string | undefined
): Promise<DatafeedAtis | undefined> {
    if (icao)
        try {
            const dataFeed = await getRawDataFeed();

            const atis = dataFeed.atis.find((atis: DatafeedAtis) => {
                return atis.callsign.startsWith(icao);
            });

            if (!atis) {
                throw new Error('Requested ATIS not found');
            }

            return atis;
        } catch (e) {
            throw e;
        }
}

export default {
    getAtis,
};
