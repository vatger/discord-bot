import axios from 'axios';
import { Config } from '../core/config';
import { VatgerUserData } from '../interfaces/vatgerApi.interface';

async function updateVatgerUser(discord_id: string): Promise<VatgerUserData> {
    try {
        return (await axios.post("http://vatsim-germany.org/api/discord/user", { discord_id: discord_id }, {
            headers: {
                Authorization: 'Token ' + Config.HP_TOKEN
            }
        })).data;

    } catch (error) {
        throw new Error(`Could not update VATGER User: ${error}`);
    }

}
export default {
    updateVatgerUser,
}