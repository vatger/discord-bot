import * as dotenv from "dotenv";

dotenv.config();

type EnvConfig = {
    BOT_TOKEN: string;
    AVWX_TOKEN: string;

    CLIENT_ID: string;
    GUILD_ID: string;

    BOT_STATUS_CHANNEL: string;
}

export const Config: EnvConfig = {
    BOT_TOKEN: process.env.BOT_TOKEN ?? "",
    AVWX_TOKEN: process.env.AVWX_TOKEN ?? "",

    CLIENT_ID: process.env.CLIENT_ID ?? "",
    GUILD_ID: process.env.GUILD_ID ?? "",

    BOT_STATUS_CHANNEL: process.env.BOT_STATUS_CHANNEL ?? "",
}
