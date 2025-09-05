import axios from 'axios';
import { Config } from '../core/config';


export interface VatgerUserData {
    discord_id: string,
    is_vatger_member: boolean,
    is_vatger_fullmember: boolean,
    atc_rating: number | null,
    pilot_rating: number | null,
    teams: string[]

}

export async function getHomepageUser(discord_id: string): Promise<VatgerUserData> {
    try {
        const data :VatgerUserData = (await axios.get("http://vatsim-germany.org/api/discord/user/" + discord_id, {
            headers: {
                Authorization: 'Token ' + Config.HP_TOKEN
            }
        })).data;
        if (!data) {
            throw new Error("No discord user found.");
        }
        return data;

    } catch (error) {
        throw new Error(`Could not get Details from VATGER: ${error}`);
    }
}

export async function pushDiscordUser(discord_id: string): Promise<string> {
    try {
        return (await axios.post("http://vatsim-germany.org/api/discord/user", { discord_id: discord_id }, {
            headers: {
                Authorization: 'Token ' + Config.HP_TOKEN
            }
        })).data;

    } catch (error) {
        throw new Error(`Could not push discord user to HP: ${error}`);
    }
}