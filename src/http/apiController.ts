import { Request, Response } from 'express';
import rolesService from '../services/rolesService';
import { GuildMember } from 'discord.js';
import { findGuildMemberByDiscordID } from '../utils/findGuildMember';

async function updateMember(req: Request, res: Response) {
        
    const guildMember: GuildMember | undefined = await findGuildMemberByDiscordID(req.body.discord_id);

    if (!guildMember) {
        return res.status(404).send({ message: 'User not found.' });
    }

    await rolesService.manageUserRoles(guildMember);

    res.send({ message: 'OK' });
}

export default {
    updateMember
};
