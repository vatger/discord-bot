import { EmbedBuilder } from 'discord.js';
import { DiscordBotClient } from '../core/client';
import { Config } from '../core/config';

export const onlineEmbed = () =>
    new EmbedBuilder()
        .setColor('Green')
        .setTitle('Bot Started')
        .setDescription(`**Version: ** ${process.env.npm_package_version}`)
        .setTimestamp()
        .setFooter({
            text: Config.BOT_NAME,
            iconURL: DiscordBotClient.user?.displayAvatarURL({
                forceStatic: true,
            }),
        });
