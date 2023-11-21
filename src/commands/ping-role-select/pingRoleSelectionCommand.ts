import {
    APIInteractionGuildMember,
    ActionRowBuilder,
    CommandInteraction,
    EmbedBuilder,
    GuildMember,
    Role,
    SlashCommandBuilder,
    StringSelectMenuBuilder,
} from 'discord.js';
import SlashCommand from '../../types/Command';
import { dangerEmbed } from '../../embeds/default/dangerEmbed';
import { Config } from '../../core/config';

export default class RoleSelectionCommand extends SlashCommand {
    constructor() {
        super('roleselection');
    }

    async run(interaction: CommandInteraction) {
        try {
            const member: GuildMember | APIInteractionGuildMember | null =
                interaction.member;

            if (member == null || !(member instanceof GuildMember)) {
                await interaction.reply({
                    embeds: [dangerEmbed('Failed', null, 'Member not found')],
                    ephemeral: true,
                });
                return;
            }

            const roles: any = member.roles.cache;
            const roleArray: string[] = [];

            roles.forEach((role: Role) => {
                roleArray.push(role.name);
            });

            const pingRoleOptions = Config.PING_GROUPS.map(group => {
                return {
                    label: group,
                    value: group,
                    default: roleArray.includes(group),
                };
            });
            const pingRoles: any = new ActionRowBuilder().addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('selectPingRole')
                    .setPlaceholder('You can select multiple roles')
                    .setMinValues(0)
                    .setMaxValues(pingRoleOptions.length)
                    .addOptions(pingRoleOptions)
            );

            const pingEmbed = new EmbedBuilder()
                .setColor(0x0099ff)
                .setTitle('Select your ping role')
                .setDescription(
                    `We have created some roles for notifications.\nBased on the role, you decide which notifications you want to see.\n**Select your roles below:**\n\n⚠️ What does each role mean:`
                )
                .setFields([
                    {
                        name: 'Aerodrome Roles (i.e. EDDF, EDDM ...)',
                        value: 'These roles are used for pings and staffing requests regarding the respective aerodrome',
                    },
                    {
                        name: 'Center Roles (i.e. CTR EDMM, CTR EDWW ...)',
                        value: 'These roles are used for pings and staffing requests regarding the respective FIR',
                    },
                    {
                        name: 'Minor Roles (i.e. Minor EDGG, Minor EDMM ...)',
                        value: 'These roles are used for pings and staffing requests regarding the minor aerodrome in the respective FIR',
                    },
                    {
                        name: 'ECFMP Roles (i.e. ECFMP EDGG, ECFMP EDWW ...)',
                        value: 'These roles are used for pings by the ECFMP Flow Measures here: <#1106925308646531142>',
                    },
                ]);


            await interaction.reply({
                components: [pingRoles],
                ephemeral: true,
                embeds: [pingEmbed],
            });
            
        } catch (error) {
            console.error(error);
        }

    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription('Select roles to get notifications for.');
    }
}
