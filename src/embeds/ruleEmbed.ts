import { EmbedBuilder } from 'discord.js';
import { StaticConfig } from '../core/config';
import { DiscordBotClient } from '../core/client';

export const welcomeEmbed = new EmbedBuilder()
    .setColor('NotQuiteBlack')
    .setTitle('Official VATSIM Germany Discord')
    .addFields([
        {
            name: '**Terms of Service & Community Guidelines**',
            value: `We ask that all members of our Discord Community abide by Discord's [Terms of Service](https://discord.com/terms) and [Community Guidelines](https://discord.com/guidelines) at all times.`,
        },
        {
            name: '**VATSIM Policy**',
            value: `VATSIM Global Policies apply on this server. Most importantly this includes the [VATSIM Code of Conduct](https://vatsim.net/docs/policy/code-of-conduct).`,
        },
    ]);

export const ruleEmbed = new EmbedBuilder()
    .setColor('Green')
    .setTitle('Rules')
    .addFields([
        {
            name: `👋 **You are welcome!**`,
            value: `We want you to enjoy this server as we do but we provide this server as a privilege, not a right to VATSIM members. Members who abuse that privilege may be removed.\n`,
        },
        {
            name: `<:vatger:1072846025150173285> **Spam, Sharing Malicious Links, and sending links in the wrong channels is not allowed**`,
            value: `Sending messages rapidly, sending the same message over and over again, posting links with inappropriate content, and redirects to viruses, phishing sites or similar is not allowed. We also ask that you share links to content in the channels allocated for that content.\n`,
        },
        {
            name: `<:vatger:1072846025150173285> **Arguing vs. Debates**`,
            value: `Debates are allowed as long as they stay constructive and respectful. Civilized conversation will always be welcome, but we ask that all parties involved maintain a level head and respect other individuals who have differing opinions.\n`,
        },
        {
            name: `<:vatger:1072846025150173285> **Harassment & Inappropriate Chat**`,
            value: `Name calling, bullying, swearing at, and belittling other people is not allowed under any circumstance. Harassing VATGER Staff regarding suspensions, applications, etc. is not allowed under any circumstance. Please only reach out through the proper channels if you have any questions or concerns for the VATGER Staff Team.\n`,
        },
        {
            name: `<:vatger:1072846025150173285> **Official Issues**`,
            value: `Be aware that not every staff member and/or mentor is on that server. For any __official__ issues, we ask you to use the proper channels like the VATGER forums, ticket system etc. .`,
        },
        {
            name: `<:vatger:1072846025150173285> **Roles & Mentions**`,
            value: `Please do not excessively mention specific roles or individuals, including VATGER Staff Members.`,
        },
        {
            name: `<:vatger:1072846025150173285> **Enforcement**`,
            value: `All Discord Rules are enforced by members of the VATGER Staff Team. Depending on the severity of an infraction, cases can be escalated to a VATSIM Responsible for further review.`,
        },
    ]);

export const vcEmbed = new EmbedBuilder().setColor('Green').addFields([
    {
        name: `🎙️**Voice Channels**`,
        value: `This server uses temporary voice channels. If you want to talk on this server, just create a new channel by joining the <#1072554524394389577>`,
    },
]);

export const botEmbed = new EmbedBuilder().setColor('Green').addFields([
    {
        name: `🤖**Bot Commands**`,
        value:
            'If you want to know what bot commands are available to you, simply type ' +
            '`/help`' +
            ' in any channel.',
    },
]);

export const additionalEmbed = new EmbedBuilder().setColor('Yellow').addFields([
    {
        name: `☝️**Sharing personal/internal Data**`,
        value: `It is not allowed to post screenshots from the VATGER forums. You are welcome to post links to a corresponding thread or post instead.`,
    },
]);

export const ticketEmbed = new EmbedBuilder()
    .setColor('Green')
    .addFields([
        {
            name: `📝**Further help**`,
            value: `For further help feel free to open a ticket via the [VATGER Ticket System](https://support.vatsim-germany.org/).`,
        },
    ])
    .setTimestamp()
    .setFooter({
        text: StaticConfig.BOT_NAME,
        iconURL: DiscordBotClient.user?.displayAvatarURL({ forceStatic: true }),
    });

export const rulesEmbeds = [
    welcomeEmbed,
    ruleEmbed,
    additionalEmbed,
    vcEmbed,
    botEmbed,
    ticketEmbed,
];
