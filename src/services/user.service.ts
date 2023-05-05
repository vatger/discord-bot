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

async function addUser(user: User): Promise<UserDocument> {
    const _user: UserDocument = new userModel({
        discordId: user.id,
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
        sendBotLogMessage('Failed to add warning to User', e.message);
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
        sendBotLogMessage('Failed to add note to User', e.message);
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
        sendBotLogMessage('Failed to retreive warning of User', e.message);
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
        sendBotLogMessage('Failed to retreive notes of User', e.message);
    }
}

export default {
    warnUser,
    noteUser,
    getUserNotes,
    getUserWarnings,
    getAllUsers,
    addUser,
    updateCid
};
