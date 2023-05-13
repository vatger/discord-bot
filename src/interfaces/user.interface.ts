interface User {
    discordId: string;
    cid: number;
    isVatger: boolean;

    warnings: UserWarning[];
    notes: UserNote[];
}

export interface UserWarning {
    _id?: string;
    authorDiscordId: string;
    reason: string;
    createdAt: Date;
}

export interface UserNote {
    _id?: string;
    authorDiscordId: string;
    message: string;
    createdAt: Date;
}

export default User;
