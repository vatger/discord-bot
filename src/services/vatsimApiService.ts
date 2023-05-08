import axios from 'axios';

async function getCIDFromDiscordID(
    discord_id: string
): Promise<Number | undefined> {
    try {
        const vatsim_cid = (
            await axios.get(
                'https://api.vatsim.net/v2/members/discord/' + discord_id
            )
        ).data as {
            id: string;
            user_id: string;
        };
        const cid: Number = Number.parseInt(vatsim_cid.user_id);

        if (cid == Number.NaN) return undefined;

        return cid;
    } catch (e: any) {
        if (e.response?.status == 404) {
            console.log('No CID found for ', discord_id);
        }

        return undefined;
    }
}

async function getRatingApi(cid?: number) {
    try {
        const rating_data = (
            await axios.get('https://api.vatsim.net/api/ratings/' + cid)
        ).data as {
            id: string;
            rating: number;
            pilotrating: number;
            susp_date?: string;
            reg_date: string;
            region: string;
            division: string;
            subdivision: string;
            lastratingchange: string;
        };

        return rating_data;
    } catch (e) {
        return undefined;
    }
}

export default {
    getCIDFromDiscordID,
    getRatingApi,
};
