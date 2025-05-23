import axios from "axios";
import { Config } from "../core/config";
import { VatgerUserData, VatgerUserUpdateData } from "../interfaces/vatgerApi.interface";

async function getUserDetailsFromVatger(cid: number): Promise<VatgerUserData> {
    try {
        if (!cid) {
            throw new Error('No CID provided.')
        }
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

async function updateVatgerUser(data: VatgerUserUpdateData): Promise<VatgerUserData> {
    try {
        const vatgerUserData =
            (await axios.put("http://vatsim-germany.org/api/discord/", data, {
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