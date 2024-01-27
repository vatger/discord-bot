import { Request, Response } from 'express';
import userModel, { UserDocument } from '../models/user.model';
import { findGuildMemberByDiscordID } from '../utils/findGuildMember';
import { Config } from '../core/config';
import { Collection, GuildMember, Role } from 'discord.js';
import userService from '../services/user.service';
import map from '../utils/departmentRolesMap';
import { DiscordBotClient } from '../core/client';

async function handleMemberJoin(request: Request, response: Response) {
    response.send({ message: 'OK' });

    try {

        const cid = request.body.cid;

        if (cid == null) {
            console.log('Received member join event with no cid!');
            return;
        }

        const user = await userModel.findOneAndUpdate(
            { cid: request.body.cid },
            {
                $set: {
                    isVatger: true,
                },
            }
        );

        const guildMember: GuildMember | undefined =
            await findGuildMemberByDiscordID(user?.discordId);

        if (guildMember == null) return;

        await guildMember.roles.add(Config.VATGER_MEMBER_ROLE_ID);
    } catch (e: any) {
        console.error('Failed ', e.message);
    }
}

async function handleMemberLeave(request: Request, response: Response) {
    response.send({ message: 'OK' });

    try {
        const cid = request.body.cid;

        if (cid == null) {
            console.log('Received member leave event with no cid!');
            return;
        }

        const user = await userModel.findOneAndUpdate(
            { cid: request.body.cid },
            {
                $set: {
                    isVatger: false,
                },
            }
        );

        const guildMember: GuildMember | undefined =
            await findGuildMemberByDiscordID(user?.discordId);

        if (guildMember == null) return;

        await guildMember.roles.remove(Config.VATGER_MEMBER_ROLE_ID);
    } catch (e: any) {
        console.error('Failed ', e.message);
    }
}

async function updateMember(req: Request, res: Response) {
    try {
        const guild = DiscordBotClient.guilds.cache.get(Config.GUILD_ID);
        const cid = req.body.cid;
        const teams: string[] = req.body.teams;

        const user: UserDocument | null = await userService.getUserByCid(cid);

        const guildMember: GuildMember | undefined = await findGuildMemberByDiscordID(user?.discordId);
        let guildMemberRoles = guildMember?.roles.cache;

        for (const group of Config.MANAGEABLE_GROUPS) {
            if (map.has(group)) {
                if (teams.includes(group) && !guildMemberRoles?.some(r => r.id === map.get(group))) {
                    await guildMember?.roles.add(map.get(group));
                } else if (!teams.includes(group) && guildMemberRoles?.some(r => r.id === map.get(group))) {
                    await guildMember?.roles.remove(map.get(group));
                }
            }
        }

        guildMemberRoles = guildMember?.roles.cache;
        const roleNamesArray: string[] = [];

        if (guildMemberRoles) {
            for (const role of guildMemberRoles) {
                roleNamesArray.push(role[1].name);
            }
        }
        
        const guildRoles: Collection<string, Role> | undefined = guild?.roles.cache;

        const navRole = guildRoles?.filter(r => r.name === 'Nav');
        const mentorRole = guildRoles?.filter(r => r.name === 'Mentor');
        const eventRole = guildRoles?.filter(r => r.name === 'Event');      

        if (navRole) {
            if (roleNamesArray.filter(x => ['EDGG Nav','EDMM Nav','EDWW Nav'].includes(x)).length > 0) {
                await guildMember?.roles.add(navRole)
            } else {
                await guildMember?.roles.remove(navRole)
            }
        }
        if (mentorRole) {
            if (roleNamesArray.filter(x => ['EDGG Mentor','EDMM Mentor','EDWW Mentor'].includes(x)).length > 0) {
                await guildMember?.roles.add(mentorRole);
            } else {
                await guildMember?.roles.remove(mentorRole);
            }
        }
        if (eventRole) {
            if (roleNamesArray.filter(x => ['EDGG Event','EDMM Event','EDWW Event'].includes(x)).length > 0) {
                await guildMember?.roles.add(eventRole)
            } else {
                await guildMember?.roles.remove(eventRole)
            }
        }

        res.send({ message: 'OK' });

    } catch (error: any) {
        console.error('Failed to update member', error.message);
    }
}

export default {
    handleMemberJoin,
    handleMemberLeave,
    updateMember
};
