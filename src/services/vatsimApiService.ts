import axios from 'axios';

async function getCIDFromDiscordID(
    discord_id: string
): Promise<number | undefined> {
    try {
        const vatsim_cid = (
            await axios.get(
                'https://api.vatsim.net/v2/members/discord/' + discord_id
            )
        ).data as {
            id: string;
            user_id: string;
        };
        const cid = Number.parseInt(vatsim_cid.user_id);

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
            await axios.get('https://api.vatsim.net/v2/members/' + cid)
        ).data as {
            id: number;
            rating: number;
            pilotrating: number;
            militaryrating: number;
            susp_date?: string;
            reg_date: string;
            region_id: string;
            division_id: string;
            subdivision_id: string;
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
