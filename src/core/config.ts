import * as dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
    BOT_NAME: string;
    BOT_TOKEN: string;
    AVWX_TOKEN: string;
    VATSIM_DATAFEED_URL: string;

    MONGO_URI: string;
    MONGO_ENABLE_SSL: boolean;
    MONGO_ENABLE_SSL_VALIDATION: boolean;

    CLIENT_ID: string;
    GUILD_ID: string;

    REGISTERED_ROLE_ID: string;
    VATGER_MEMBER_ROLE_ID: string;
    MODERATOR_CHANNEL_ID: string;

    BOT_STATUS_CHANNEL_ID: string;
    WELCOME_CHANNEL_ID: string;
    ATC_NOTIFY_CHANNEL_ID: string;

    UPDATE_RULES: string;

    API_PORT: number;

    PING_GROUPS: string[];
};

export const Config: EnvConfig = {
    BOT_NAME: process.env.BOT_NAME ?? 'VATSIM Germany',
    BOT_TOKEN: process.env.BOT_TOKEN ?? '',
    AVWX_TOKEN: process.env.AVWX_TOKEN ?? '',
    VATSIM_DATAFEED_URL:
        process.env.VATSIM_DATAFEED_URL ??
        'http://data.vatsim.net/v3/vatsim-data.json',

    MONGO_URI: process.env.MONGO_URI ?? '',
    MONGO_ENABLE_SSL: process.env.MONGO_ENABLE_SSL == 'true',
    MONGO_ENABLE_SSL_VALIDATION:
        process.env.MONGO_ENABLE_SSL_VALIDATION == 'true',

    CLIENT_ID: process.env.CLIENT_ID ?? '',
    GUILD_ID: process.env.GUILD_ID ?? '',

    REGISTERED_ROLE_ID: process.env.REGISTERED_ROLE_ID ?? '',
    VATGER_MEMBER_ROLE_ID: process.env.VATGER_MEMBER_ROLE_ID ?? '',
    MODERATOR_CHANNEL_ID: process.env.MODERATOR_CHANNEL_ID ?? '',

    BOT_STATUS_CHANNEL_ID: process.env.BOT_STATUS_CHANNEL_ID ?? '',
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID ?? '',
    ATC_NOTIFY_CHANNEL_ID: process.env.ATC_NOTIFY_CHANNEL_ID ?? '',
    UPDATE_RULES: process.env.UPDATE_RULES ?? 'false',

    API_PORT:
        Number(process.env.API_PORT) == Number.NaN
            ? 8000
            : Number(process.env.API_PORT),

    PING_GROUPS: ['EDDH','EDDB','EDDV','EDDL','EDDK','EDDF','EDDS', 'EDDN', 'EDDM', 'CTR EDWW', 'CTR EDGG', 'CTR EDMM', 'Minor EDWW', 'Minor EDGG', 'Minor EDMM', 'ECFMP EDWW', 'ECFMP EDGG', 'ECFMP EDMM']
};
