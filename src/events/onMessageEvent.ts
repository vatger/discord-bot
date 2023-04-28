import DiscordEvent from "../types/Event";
import {Events, Message} from "discord.js";

export default class OnMessageCreateEvent extends DiscordEvent {
    constructor() {
        super(Events.MessageCreate);
    }

    async run(message: Message)
    {
        if (message.author.bot)
            return;

        await message.reply({
            content: "Hello World!"
        })
    }
}