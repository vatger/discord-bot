import DiscordEvent from "../types/Event";
import {
    Events,
    AuditLogEvent,
    Message,
    PartialMessage, User
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

            let logs = await message.guild?.fetchAuditLogs({limit: 5, type: AuditLogEvent.MessageDelete});

            // Apply some basic checks to find the correct (if existent) audit log
            // Check if the audit log user is not equal to the message user (this wouldn't create an audit log entry)
            // Check if the channel ids match
            // Check if the audit log is less than 10s old
            let entry = logs?.entries.find((a) => {
                return a?.executor?.id != message.author?.id &&
                    a?.extra.channel.id == message.channel.id &&
                    Date.now() - (a?.createdTimestamp ?? 0) < 10000
            });

            // Check if the user that deleted the message is the same as the author.
            // In this case we can set the user to the author, since the message was deleted on his own
            // No Audit Log would be provided in this case
            let deletedByUser: User | null = message.author;
            if (entry != null) {
                // If the audit log entry exists
                deletedByUser = entry.executor;
            }

            const deleteEmbed = dangerEmbed("Message Deleted", null);
            deleteEmbed.addFields(
                {name: "Author", value: message.author?.id ? `<@${message.author.id}>` : "N/A"},
                {name: "Deleted By", value: deletedByUser?.id ? `<@${deletedByUser?.id}>` : "N/A"},
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