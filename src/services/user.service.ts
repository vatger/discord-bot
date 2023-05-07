import {GuildMember, PartialGuildMember, User} from 'discord.js';
import userModel, { UserDocument } from '../models/user.model';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';

async function getAllUsers() {
    try {
        const users: UserDocument[] = await userModel.find();

        return users;
    } catch (error) {}
}

async function updateCid(user: GuildMember | PartialGuildMember, cid: number): Promise<void> {
    await userModel.findOneAndUpdate(
        {discordId: user.id},
        {
            $set: {
                cid: cid
            },
        },
        {upsert: true}
    );
}

async function addUser(user: User, cid?: Number): Promise<UserDocument> {
    const _user: UserDocument = new userModel({
        discordId: user.id,
        cid: cid ?? null
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
            {upsert: true}
        );
    } catch (e: any) {
        await sendBotLogMessage('Failed to add warning to User', e.message);
    }
}

async function deleteWarn(user: User, warn_id: string) {
    try {
        const _user = await userModel.findOneAndUpdate(
            {discordId: user.id},
            {
                $pull: {
                    warnings: [
                        {
                            _id: warn_id
                        }
                    ]
                }
            }
        );

        return true;
    } catch (e: any) {
        await sendBotLogMessage('Failed to remove warning from User', e.message);
        return false;
    }
}


async function noteUser(author: User, user: User, message: string | null) {
    try {
        const _user = await userModel.findOneAndUpdate(
            {discordId: user.id},
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
        await sendBotLogMessage('Failed to retreive warning of User', e.message);
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

export default {
    warnUser,
    deleteWarn,
    noteUser,
    getUserNotes,
    getUserWarnings,
    getAllUsers,
    addUser,
    updateCid
};
