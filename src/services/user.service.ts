import { GuildMember } from 'discord.js';
import userModel, { UserDocument } from '../models/user.model';
import { getValidUpdateOpsFromNestedObject } from '../utils/nestedObjects';
import vatgerApiService from './vatgerApiService';
import vatsimApiService from './vatsimApiService';

async function getAllUsers() {
    try {
        const users: UserDocument[] = await userModel.find();

        return users;
    } catch (error) {
    }
}

async function upsertUser(user: GuildMember): Promise<UserDocument> {
    const id = await vatsimApiService.getCIDFromDiscordID(user.id);

    const _user = await userModel.findOneAndUpdate({
        id: user.id,
      }, {
        $set: {
            discordId: id,
        },
      }, {
        new: true,
        upsert: true,
      });

      return _user;
}

async function updateUser(user: GuildMember, changes: Partial<UserDocument>) {
    try {
        const _user = await getUserByDiscordId(user.id);

        const changeOps = getValidUpdateOpsFromNestedObject(changes);

        const userDocument = await userModel.findOneAndUpdate({ discordId: user.id }, { $set: changeOps }, { new: true, upsert: true }).exec();

        return userDocument
    } catch (error) {
        throw new Error(`Could not update user: ${error}`);
    }
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

async function getUserByCid(cid: number): Promise<UserDocument> {
    try {
        const user: UserDocument | null = await userModel.findOne({ cid: cid });

        if (!user) {
            throw new Error('User not found.');
        }
        return user;
    } catch (error) {
        throw new Error(`Cant get user CID: ${error}`);
    }

}

async function checkIsVatger(discordId: string) {
    try {

        const _user = await userModel.findOne({
            discordId: discordId
        });

        if (_user) {

            const vatgerApiData = await vatgerApiService.getUserDetailsFromVatger(_user.cid);
    
            console.log(vatgerApiData);
    
            return vatgerApiData.is_vatger_member;
        }

    } catch (error) {
        throw new Error(`Could not determine check is VATGER for ${discordId}`);
    }
}

export default {
    getAllUsers,
    upsertUser,
    checkIsVatger,
    getUserByCid,
    getUserByDiscordId,
    updateUser
};
