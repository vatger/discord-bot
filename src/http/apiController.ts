import {Request, Response} from "express";
import userModel from "../models/user.model";
import {findGuildMemberByDiscordID} from "../utils/findGuildMember";
import {Config} from "../core/config";
import {GuildMember} from "discord.js";

async function handleMemberJoin(request: Request, response: Response)
{
    response.send({message: "OK"});

    try {
        const cid = request.body.cid;

        if (cid == null) {
            console.log("Received member join event with no cid!")
            return;
        }

        const user = await userModel.findOneAndUpdate(
            {cid: request.body.cid},
            {
                $set: {
                    is_vatger: true
                }
            },
            {}
        );

        const guildMember: GuildMember | undefined = await findGuildMemberByDiscordID(user?.discordId);

        if (guildMember == null)
            return;

        await guildMember.roles.add(Config.VATGER_MEMBER_ROLE_ID);
    } catch (e: any)
    {
        console.error("Failed ", e.message);
    }
}

async function handleMemberLeave(request: Request, response: Response) {
    response.send({message: "OK"});

    try {
        const cid = request.body.cid;

        if (cid == null) {
            console.log("Received member leave event with no cid!")
            return;
        }

        const user = await userModel.findOneAndUpdate(
            {cid: request.body.cid},
            {
                $set: {
                    is_vatger: false
                }
            },
            {}
        );

        const guildMember: GuildMember | undefined = await findGuildMemberByDiscordID(user?.discordId);

        if (guildMember == null)
            return;

        await guildMember.roles.remove(Config.VATGER_MEMBER_ROLE_ID);
    } catch (e: any)
    {
        console.error("Failed ", e.message);
    }
}


export default {
    handleMemberJoin,
    handleMemberLeave
}