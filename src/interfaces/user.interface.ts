interface User {
    discordId: string;
    cid: number;

    warnings: UserWarning[];
    notes: UserNote[];
}

interface UserWarning {
    authorDiscordId: string;
    reason: string;
    createdAt: Date;
}

interface UserNote {
    authorDiscordId: string;
    message: string;
    createdAt: Date;
}

export default User;