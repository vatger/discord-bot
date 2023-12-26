import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';
import * as packageJson from '../../package.json';

export const onlineEmbed = () =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Bot Started')
        .setDescription(`**Version: ** ${packageJson.version}`)
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
