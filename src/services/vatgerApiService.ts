import axios from "axios";
import { Config } from "../core/config";
import { VatgerUserData } from "../interfaces/vatgerApi.interface";

async function getUserDetailsFromVatger(discord_id: string): Promise<VatgerUserData> {
    try {
        if (!discord_id) {
            throw new Error('No CID provided.')
        }
        const vatgerApiData =
            (await axios.get("http://vatsim-germany.org/api/discord/user" + discord_id, {
                headers: {
                    Authorization: 'Token ' + Config.HP_TOKEN
                }
            })).data;

        return vatgerApiData;

    } catch (error) {
        throw new Error(`Could not get Details from VATGER: ${error}`);
    }
}

async function updateVatgerUser(discord_id: string): Promise<VatgerUserData> {
    try {
        const vatgerUserData =
            (await axios.post("http://vatsim-germany.org/api/discord/user", {discord_id: discord_id}, {
                headers: {
                    Authorization: 'Token ' + Config.HP_TOKEN
                }
            })).data;

        return vatgerUserData;

    } catch (error) {
        throw new Error(`Could not update VATGER User: ${error}`);
    }

}
export default {
    getUserDetailsFromVatger,
    updateVatgerUser,
}