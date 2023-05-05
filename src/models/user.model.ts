import mongoose, { HydratedDocument } from 'mongoose';
import User from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

const userSchema = new mongoose.Schema(
    {
        discordId: { type: String, unique: true, required: true },
        cid: { type: Number, default: null },
        is_vatger: {type: Boolean, default: false},

        warnings: [{
            authorDiscordId: { type: String, required: true },
            reason: {type: String, default: '' },
            createdAt: { type: Date, default: new Date()}
        }],
    
        notes: [{
            authorDiscordId: {type: String, required: true},
            message: {type: String, default: ''},
            createdAt: {type: Date, default: new Date()}
        }],
    },
    { timestamps: true }
);

export default mongoose.model<UserDocument>('User', userSchema);