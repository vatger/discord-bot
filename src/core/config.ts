import * as dotenv from 'dotenv';

dotenv.config();

type EnvConfig = {
    BOT_NAME: string;
    BOT_TOKEN: string;
    AVWX_TOKEN: string;
    VATSIM_DATAFEED_URL: string;

    CLIENT_ID: string;
    GUILD_ID: string;

    REGISTERED_ROLE_ID: string;
    VATGER_MEMBER_ROLE_ID: string;
    MODERATOR_CHANNEL_ID: string;

    BOT_STATUS_CHANNEL_ID: string;
    WELCOME_CHANNEL_ID: string;
    ATC_NOTIFY_CHANNEL_ID: string;
    REGISTRATION_HELP_CHANNEL_ID: string;

    UPDATE_RULES: string;
    UPDATE_REGISTRATION_HELP: string;
    UPDATE_VATGER_CONNECTIONS: boolean;

    CLEANUP_CHANNEL_IDS: string;

    API_PORT: number;
    HP_TOKEN: string;

    PING_GROUPS: string[];
    MANAGEABLE_GROUPS: string[];

    EVENT_UPDATE: boolean;
    EVENT_UPDATE_CRON: string;

    STAFFING_REQUEST: boolean;
    STAFFING_REQUEST_CHANNEL_ID: string;
};

export const Config: EnvConfig = {
    BOT_NAME: process.env.BOT_NAME ?? 'VATSIM Germany',
    BOT_TOKEN: process.env.BOT_TOKEN ?? '',
    AVWX_TOKEN: process.env.AVWX_TOKEN ?? '',
    VATSIM_DATAFEED_URL:
        process.env.VATSIM_DATAFEED_URL ??
        'http://data.vatsim.net/v3/vatsim-data.json',

    CLIENT_ID: process.env.CLIENT_ID ?? '',
    GUILD_ID: process.env.GUILD_ID ?? '',

    REGISTERED_ROLE_ID: process.env.REGISTERED_ROLE_ID ?? '',
    VATGER_MEMBER_ROLE_ID: process.env.VATGER_MEMBER_ROLE_ID ?? '',
    MODERATOR_CHANNEL_ID: process.env.MODERATOR_CHANNEL_ID ?? '',
    REGISTRATION_HELP_CHANNEL_ID: process.env.REGISTRATION_HELP_CHANNEL_ID ?? '',

    BOT_STATUS_CHANNEL_ID: process.env.BOT_STATUS_CHANNEL_ID ?? '',
    WELCOME_CHANNEL_ID: process.env.WELCOME_CHANNEL_ID ?? '',
    ATC_NOTIFY_CHANNEL_ID: process.env.ATC_NOTIFY_CHANNEL_ID ?? '',
    UPDATE_RULES: process.env.UPDATE_RULES ?? 'false',
    UPDATE_REGISTRATION_HELP: process.env.UPDATE_REGISTRATION_HELP ?? 'false',
    UPDATE_VATGER_CONNECTIONS: process.env.UPDATE_VATGER_CONNECTIONS === 'true',

    CLEANUP_CHANNEL_IDS: process.env.CLEANUP_CHANNEL_IDS ?? '',

    API_PORT:
        Number(process.env.API_PORT) == Number.NaN
            ? 8000
            : Number(process.env.API_PORT),

    HP_TOKEN: process.env.HP_TOKEN ?? '',

    PING_GROUPS: ['EDDH', 'EDDB', 'EDDV', 'EDDL', 'EDDK', 'EDDF', 'EDDS', 'EDDP', 'EDDN', 'EDDM', 'CTR EDWW', 'CTR EDGG', 'CTR EDMM', 'Minor EDWW', 'Minor EDGG', 'Minor EDMM', 'ECFMP EDWW', 'ECFMP EDGG', 'ECFMP EDMM'],
    MANAGEABLE_GROUPS: ['EDWW Mentor', 'EDGG Mentor', 'EDMM Mentor', 'S1 Mentor', 'Mentor', 'EDWW Nav', 'EDGG Nav', 'EDMM Nav', 'NAV', 'EDWW Event', 'EDGG Event', 'EDMM Event', 'Event', 'PTD Trainer', 'PMP Mentor','EDGG Leitung','EDMM Leitung','EDWW Leitung','Tech Leitung','VATGER Leitung','NAV Leitung','PTD Leitung','PR & Event Leitung','ATD Leitung'],

    EVENT_UPDATE: process.env.EVENT_UPDATE == 'true',
    EVENT_UPDATE_CRON: process.env.EVENT_UPDATE_CRON ?? '0 */3 0 0 0',

    STAFFING_REQUEST: process.env.STAFFING_REQUEST === 'true',
    STAFFING_REQUEST_CHANNEL_ID: process.env.STAFFING_REQUEST_CHANNEL_ID ?? ''
};
