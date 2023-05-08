import { DiscordBotClient } from '../core/client';
import DiscordEvent from '../types/Event';
import { Events, GuildAuditLogsEntry, AuditLogEvent } from 'discord.js';
import { sendModeratorMessage } from '../utils/sendModeratorMessage';
import { sendBotLogMessage } from '../utils/sendBotLogMessage';

export default class OnGuldAuditLogEntryCreateEvent extends DiscordEvent {
    constructor() {
        super(Events.GuildAuditLogEntryCreate);
    }

    async run(auditLog: GuildAuditLogsEntry<AuditLogEvent>) {
        try {
            const {
                action,
                executorId: executorID,
                targetId: targetID,
                reason,
            } = auditLog;

            if (action == AuditLogEvent.MemberKick) {
                await sendModeratorMessage('User Kicked', [
                    {
                        name: 'User',
                        value: `<@${targetID}>`,
                    },
                    {
                        name: 'Kicked By',
                        value: `<@${executorID}>`,
                    },
                    {
                        name: 'Reason',
                        value: `\`\`\`${reason ?? 'N/A'}\`\`\``,
                    },
                ]);
            }

            if (action == AuditLogEvent.MemberBanAdd) {
                await sendModeratorMessage('User Banned', [
                    {
                        name: 'User',
                        value: `<@${targetID}>`,
                    },
                    {
                        name: 'Banned By',
                        value: `<@${executorID}>`,
                    },
                    {
                        name: 'Reason',
                        value: `\`\`\`${reason ?? 'N/A'}\`\`\``,
                    },
                ]);
            }
        } catch (e: any) {
            await sendBotLogMessage('Audit Message Log Failed', e.message);
        }
    }
}
