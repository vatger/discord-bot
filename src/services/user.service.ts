import { GuildMember, PartialGuildMember, User } from 'discord.js';
import userModel, { UserDocument } from '../models/user.model';
import axios from "axios";
import { findGuildMemberByDiscordID } from "../utils/findGuildMember";
import { Config } from "../core/config";

async function getAllUsers() {
    try {
        const users: UserDocument[] = await userModel.find();

        return users;
    } catch (error) {
    }
}

async function updateCid(
    user: GuildMember | PartialGuildMember,
    cid: number
): Promise<void> {
    await userModel.findOneAndUpdate(
        { discordId: user.id },
        {
            $set: {
                cid: cid,
            },
        },
        { upsert: true }
    );
}

async function addUser(user: User, cid?: Number): Promise<UserDocument> {
    const _user: UserDocument = new userModel({
        discordId: user.id,
        cid: cid ?? null,
    });
    try {
        await _user.save();
    } catch (error) {
        throw error;
    }
    return _user;
}

async function checkIsVatger(discordId: string) {
    const _user = await userModel.findOne({
        discordId: discordId
    });

    if (_user == null || _user.cid == null)
        throw new Error("User with discord ID " + discordId + " is not in the database or the CID is not present");

    const vatgerApiData:
        {
            is_vatger_member: boolean,
            is_vatger_fullmember: boolean,
            atc_rating: number | null,
            pilot_rating: number | null
        } =
        (await axios.get("http://vatsim-germany.org/api/discord/" + _user.cid, {
            headers: {
                Authorization: 'Token ' + Config.HP_TOKEN
            }
        })).data;

    if (!vatgerApiData.is_vatger_fullmember) {
        return false;
    } else 

    await userModel.updateOne({
        discordId: _user.discordId,
        cid: _user.cid
    }, {
        $set: {
            isVatger: true
        }
    });

    const guildMember = await findGuildMemberByDiscordID(discordId);
    await guildMember?.roles.add(Config.VATGER_MEMBER_ROLE_ID);

    return vatgerApiData.is_vatger_fullmember;
}

export default {
    getAllUsers,
    addUser,
    updateCid,
    checkIsVatger,
};
