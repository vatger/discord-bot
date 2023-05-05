import {Guild, GuildMember, User} from "discord.js";
import {DiscordBotClient} from "../core/client";
import {Config} from "../core/config";

export async function findGuildMemberByDiscordID(discord_id?: string)
{
    const guild: Guild | undefined = DiscordBotClient.guilds.cache.find((guild) => guild.id == Config.GUILD_ID);
    const guildMember: GuildMember | undefined = guild?.members.cache.find((gMember) => gMember.id == discord_id);

    return guildMember;
}