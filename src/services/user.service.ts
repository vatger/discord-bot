import {GuildMember, PartialGuildMember, User} from 'discord.js';
import userModel, {UserDocument} from '../models/user.model';
import {sendBotLogMessage} from '../utils/sendBotLogMessage';
import axios from "axios";
import {dangerEmbed} from "../embeds/default/dangerEmbed";
import {findGuildMemberByDiscordID} from "../utils/findGuildMember";
import {Config} from "../core/config";

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

async function warnUser(author: User, user: User, reason: string | null) {
    try {
        const _user = await userModel.findOneAndUpdate(
            { discordId: user.id },
            {
                $push: {
                    warnings: [
                        {
                            authorDiscordId: author.id,
                            reason: reason ?? '',
                        },
                    ],
                },
            },
            { upsert: true }
        );
    } catch (e: any) {
        await sendBotLogMessage('Failed to add warning to User', e.message);
    }
}

async function deleteWarn(user: User, warn_id: string) {
    try {
        const _user = await userModel.findOneAndUpdate(
            { discordId: user.id },
            {
                $pull: {
                    warnings: {
                        _id: warn_id,
                    },
                },
            },
            { returnOriginal: true }
        );

        return _user;
    } catch (e: any) {
        await sendBotLogMessage(
            'Failed to remove warning from User',
            e.message
        );
        return undefined;
    }
}

async function noteUser(author: User, user: User, message: string | null) {
    try {
        const _user = await userModel.findOneAndUpdate(
            { discordId: user.id },
            {
                $push: {
                    notes: [
                        {
                            authorDiscordId: author.id,
                            message: message ?? '',
                        },
                    ],
                },
            },
            { upsert: true }
        );
    } catch (e: any) {
        await sendBotLogMessage('Failed to add note to User', e.message);
    }
}

async function getUserWarnings(user: User) {
    try {
        const _user: UserDocument | null = await userModel.findOne({
            discordId: user.id,
        });

        if (!_user) {
            throw new Error('No User found');
        }

        return _user.warnings;
    } catch (e: any) {
        await sendBotLogMessage(
            'Failed to retreive warning of User',
            e.message
        );
    }
}

async function getUserNotes(user: User) {
    try {
        const _user: UserDocument | null = await userModel.findOne({
            discordId: user.id,
        });

        if (!_user) {
            throw new Error('No User found');
        }

        return _user.notes;
    } catch (e: any) {
        await sendBotLogMessage('Failed to retreive notes of User', e.message);
    }
}

async function checkIsVatger(discordId: string) {
    const _user = await userModel.findOne({
        discordId: discordId
    });

    if (_user == null || _user.cid == null)
        throw new Error("User with discord ID " + discordId + " is not in the database or the CID is not present");

    const res = await axios.get("http://hp.vatsim-germany.org/api/account/" + _user.cid + "/isger");
    const isVatger = res.data as boolean;

    // If this is already the saved state, then we already assigned roles, etc.
    if (isVatger == _user.isVatger) {
        throw new Error("You are already registered. No changes to your account have been made");
    }

    await userModel.updateOne({
        discordId: _user.discordId,
        cid: _user.cid
    }, {
        $set: {
            isVatger: isVatger
        }
    });

    const guildMember = await findGuildMemberByDiscordID(discordId);

    if (isVatger)
        await guildMember?.roles.add(Config.VATGER_MEMBER_ROLE_ID);
    else
        await guildMember?.roles.remove(Config.VATGER_MEMBER_ROLE_ID);

    return isVatger;
}

export default {
    warnUser,
    deleteWarn,
    noteUser,
    getUserNotes,
    getUserWarnings,
    getAllUsers,
    addUser,
    updateCid,
    checkIsVatger,
};
