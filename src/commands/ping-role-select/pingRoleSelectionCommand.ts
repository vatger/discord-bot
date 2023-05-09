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
        super('pingselection');
    }

    async run(interaction: CommandInteraction) {
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
                description: 'Get the respective ping role',
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
                `We have created some roles for notifications.\nBased on the role, you decide which notification you want to see.\n\n **Select your roles below:**`
            );

        await interaction.reply({
            components: [pingRoles],
            ephemeral: true,
            embeds: [pingEmbed],
        });
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(
                'Select roles to get notifications.'
            );
    }
}
