import axios from "axios";
import { Config } from "../core/config";

async function getUserDetailsFromVatger(cid: number): Promise<{
    is_vatger_member: boolean,
    is_vatger_fullmember: boolean,
    atc_rating: number | null,
    pilot_rating: number | null,
    teams: string[]
}> {
    try {
        const vatgerApiData =
            (await axios.get("http://vatsim-germany.org/api/discord/" + cid, {
                headers: {
                    Authorization: 'Token ' + Config.HP_TOKEN
                }
            })).data;

        return vatgerApiData;

    } catch (error) {
        throw new Error(`Could not get Details from VATGER: ${error}`);
    }


}

export default {
    getUserDetailsFromVatger
}