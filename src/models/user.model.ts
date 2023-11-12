import mongoose, { HydratedDocument } from 'mongoose';
import User from '../interfaces/user.interface';

export type UserDocument = HydratedDocument<User>;

const userSchema = new mongoose.Schema(
    {
        discordId: { type: String, unique: true, required: true },
        cid: { type: Number, default: null },
        isVatger: { type: Boolean, default: false },
        controllerRating: {type: Number, default: null},
        pilotRating: {type: Number, default: null},
        militaryRating: {type: Number, default: null}
    },
    { timestamps: true }
);

export default mongoose.model<UserDocument>('User', userSchema);
