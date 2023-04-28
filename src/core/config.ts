import * as dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
    BOT_TOKEN: string;
    AVWX_TOKEN: string;
    VATSIM_DATAFEED_URL: string;

    CLIENT_ID: string;
    GUILD_ID: string;

    BOT_STATUS_CHANNEL_ID: string;
    WELCOME_CHANNEL_ID: string;
    ATC_NOTIFY_CHANNEL_ID: string;

    UPDATE_RULES: string;
};

export const Config: EnvConfig = {
    BOT_TOKEN: process.env.BOT_TOKEN ?? '',
    AVWX_TOKEN: process.env.AVWX_TOKEN ?? '',
    VATSIM_DATAFEED_URL: process.env.VATSIM_DATAFEED_URL ?? 'http://data.vatsim.net/v3/vatsim-data.json',

    CLIENT_ID: process.env.CLIENT_ID ?? '',
    GUILD_ID: process.env.GUILD_ID ?? '',

    BOT_STATUS_CHANNEL_ID: process.env.BOT_STATUS_CHANNEL_ID ?? '',
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID ?? '',
    ATC_NOTIFY_CHANNEL_ID: process.env.ATC_NOTIFY_CHANNEL_ID ?? '',
    UPDATE_RULES: process.env.UPDATE_RULES ?? 'false'
};
