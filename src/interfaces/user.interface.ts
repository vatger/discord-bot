interface User {
    discordId: string;
    cid: number;
    is_vatger: boolean;

    warnings: UserWarning[];
    notes: UserNote[];
}

export interface UserWarning {
    authorDiscordId: string;
    reason: string;
    createdAt: Date;
}

export interface UserNote {
    authorDiscordId: string;
    message: string;
    createdAt: Date;
}

export default User;