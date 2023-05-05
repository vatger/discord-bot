import userModel, { UserDocument } from '../models/user.model';
import DiscordEvent from '../types/Event';
import { Events, GuildMember } from 'discord.js';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';
import axios from "axios";

export default class OnGuildMemberAddEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildMemberAdd);
    }

    async run(user: GuildMember) {
        // Register user to database

        try {
            const vatsim_cid = (await axios.get("https://api.vatsim.net/v2/members/discord/" + user.id)).data as {id: string; user_id: string};
            const cid: Number = Number.parseInt(vatsim_cid.user_id);

            console.log(cid);
            await userModel.findOneAndUpdate(
                { discordId: user.id },
                {
                    $set: {
                        cid: cid
                    }
                },
                { upsert: true, returnOriginal: false }
            );
        } catch (e: any) {
            await sendBotLogMessage("Failed to add User to Database", e.message);
        }
    }
}
