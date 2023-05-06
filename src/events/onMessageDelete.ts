import DiscordEvent from "../types/Event";
import {
    Events,
    AuditLogEvent,
    Message,
    PartialMessage
} from "discord.js";
import {sendModeratorEmbed} from "../utils/sendModeratorMessage";
import {DiscordBotClient} from "../core/client";
import {sleep} from "../utils/sleep";
import {dangerEmbed} from "../embeds/default/dangerEmbed";

export default class OnMessageDelete extends DiscordEvent {
    constructor() {
        super(Events.MessageDelete);
    }

    async run(message: Message | PartialMessage)
    {
        if (message.author?.id == DiscordBotClient.user?.id || message.author?.bot)
        {
            return;
        }

        try {
            // Wait one second, since the audit log may be a little slow :)
            await sleep(1000);

            let logs = await message.guild?.fetchAuditLogs({type: AuditLogEvent.MessageDelete});
            let entry = logs?.entries.first();

            const deleteEmbed = dangerEmbed("Message Deleted", null);
            deleteEmbed.addFields(
                {name: "Author", value: message.author?.id ? `<@${message.author.id}>` : "N/A"},
                {name: "Deleted By", value: entry?.executor?.id ? `<@${entry.executor.id}>` : "N/A"},
                {name: "Channel", value: `<#${message.channel.id}>`},
                {name: "Message", value: (message.content && message.content.length > 0) ? message.content : "-"}
            );
            deleteEmbed.setThumbnail(message.author?.displayAvatarURL({forceStatic: true}) ?? null);

            await sendModeratorEmbed(deleteEmbed);
        } catch (e: any){
            console.log(e);
        }
    }
}