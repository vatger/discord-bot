import * as dotenv from "dotenv";

dotenv.config();

type EnvConfig = {
    BOT_TOKEN: string;
    CLIENT_ID: string;
    GUILD_ID: string;
}

export const Config: EnvConfig = {
    BOT_TOKEN: process.env.BOT_TOKEN ?? "",
    CLIENT_ID: process.env.CLIENT_ID ?? "",
    GUILD_ID: process.env.GUILD_ID ?? ""
}
