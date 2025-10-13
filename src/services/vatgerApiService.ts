import axios from 'axios';
import { Config } from '../core/config';

export interface VatgerUserData {
    discord_id: string;
    vatsim_id: string | null;
    is_guest: boolean;
    is_vatger_member: boolean;
    fir_name: string | null;
    atc_rating: number | null;
    pilot_rating: number | null;
    teams: string[];
}

function getEmptyVatgerUserData(discord_id: string): VatgerUserData {
    return {
        discord_id,
        vatsim_id: null,
        is_guest: false,
        is_vatger_member: false,
        fir_name: null,
        atc_rating: null,
        pilot_rating: null,
        teams: [],
    };
}

export async function getHomepageUser(discord_id: string): Promise<VatgerUserData> {
    try {
        const data: VatgerUserData = (
            await axios.get('http://vatsim-germany.org/api/discord/user/' + discord_id, {
                headers: {
                    Authorization: 'Token ' + Config.HP_TOKEN,
                },
            })
        ).data;

        if (!data) {
            return getEmptyVatgerUserData(discord_id);
        }

        return data;
    } catch (error) {
        console.error(`Failed to fetch VatgerUserData for ${discord_id}`, error);
        return getEmptyVatgerUserData(discord_id);
    }
}

export async function pushDiscordUser(discord_id: string): Promise<string> {
    try {
        return (
            await axios.post(
                'http://vatsim-germany.org/api/discord/user',
                { discord_id: discord_id },
                {
                    headers: {
                        Authorization: 'Token ' + Config.HP_TOKEN,
                    },
                },
            )
        ).data;
    } catch (error) {
        throw new Error(`Could not push discord user to HP: ${error}`);
    }
}
