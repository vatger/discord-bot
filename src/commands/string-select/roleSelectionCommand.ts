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
        const member: GuildMember | APIInteractionGuildMember | null =
            interaction.member;

        if (member == null || !(member instanceof GuildMember)) {
            await interaction.reply({
                embeds: [dangerEmbed('Failed', 'Member not found')],
                ephemeral: true,
            });
            return;
        }

        const roles: any = member.roles.cache;
        const roleArray: string[] = [];

        roles.forEach((role: Role) => {
            roleArray.push(role.name);
        });

        const regionalGroupOptions = Config.RG_GROUPS.map(group => {
            return {
                label: group,
                description: 'See the respective RG Channel',
                value: group,
                default: roleArray.includes(group),
            };
        });
        const regionalGroups: any = new ActionRowBuilder().addComponents(
            new StringSelectMenuBuilder()
                .setCustomId('selectFir')
                .setPlaceholder('You can select multiple roles')
                .setMinValues(0)
                .setMaxValues(regionalGroupOptions.length)
                .addOptions(regionalGroupOptions)
        );

        const rgEmbed = new EmbedBuilder()
            .setColor(0x0099ff)
            .setTitle('Select your RG')
            .setDescription(
                `We have created a separate channel for each regional group on this server.\nBased on the role, you decide which channels you want to see.\n\n **Select your roles below:**`
            );

        await interaction.reply({
            components: [regionalGroups],
            ephemeral: true,
            embeds: [rgEmbed],
        });
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription(
                'Assign your roles, which channels you want to see'
            );
    }
}
