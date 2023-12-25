import { GuildMember, PartialGuildMember, User, Utils } from 'discord.js';
import userModel, { UserDocument } from '../models/user.model';
import axios from "axios";
import { findGuildMemberByDiscordID } from "../utils/findGuildMember";
import { Config } from "../core/config";
import { getValidUpdateOpsFromNestedObject } from '../utils/nestedObjects';
import vatgerApiService from './vatgerApiService';

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

async function updateUser(user: GuildMember, changes: Partial<UserDocument>) {
    try {
        console.log('run update user');
        const _user = await getUserByDiscordId(user.id);

        const changeOps = getValidUpdateOpsFromNestedObject(changes);

        const userDocument = await userModel.findOneAndUpdate({ discordId: user.id }, { $set: changeOps }, { new: true }).exec();

        return userDocument
    } catch (error) {
        throw new Error(`Could not update user: ${error}`);
    }
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

async function getUserByDiscordId(discordId: string) {
    try {
        const user: UserDocument | null = await userModel.findOne({ discordId: discordId });

        if (user) {
            return user;
        }
    } catch (error) {
        throw new Error(`Cant get user by discord ID: ${error}`);
    }

}

async function getUserByCid(cid: number) {
    try {
        const user: UserDocument | null = await userModel.findOne({ cid: cid });

        if (user) {
            return user;
        }
    } catch (error) {
        throw new Error(`Cant get user CID: ${error}`);
    }

}

async function checkIsVatger(discordId: string) {
    try {
        console.info('Check is Vatger');

        const _user = await userModel.findOne({
            discordId: discordId
        });

        //console.log('user is' , _user);

        if (_user) {

            const vatgerApiData = await vatgerApiService.getUserDetailsFromVatger(_user.cid);
    
            console.log(vatgerApiData);
    
            return vatgerApiData.is_vatger_member;
        }

    } catch (error) {
        throw new Error(`Could not determine check is VATGER`);
    }
}

export default {
    getAllUsers,
    addUser,
    updateCid,
    checkIsVatger,
    getUserByCid,
    getUserByDiscordId,
    updateUser
};
