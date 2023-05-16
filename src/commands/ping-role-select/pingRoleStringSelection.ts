import SlashCommand from '../../types/Command';
import {
    StringSelectMenuInteraction,
    GuildMember,
    APIInteractionGuildMember,
    EmbedBuilder,
    Role,
    Collection,
} from 'discord.js';
import { Config } from '../../core/config';
import rolesService from '../../services/rolesService';

export default class SelectFirStringSelection extends SlashCommand {
    constructor() {
        super('selectPingRole');
    }

    async run(interaction: StringSelectMenuInteraction) {
        await interaction.deferReply({ ephemeral: true });

        const member: GuildMember | APIInteractionGuildMember | null =
            interaction.member;
        const roles: Collection<string, Role> | undefined =
            interaction.guild?.roles.cache;

        if (member == null || !(member instanceof GuildMember)) return;

        await rolesService._addUserRoles(interaction, roles, member);
        await rolesService._removeUserRoles(
            interaction,
            roles,
            member,
            Config.PING_GROUPS
        );

        let newRoles: Collection<string, Role> | undefined = member.roles.cache;
        newRoles = newRoles?.filter((role: Role) => {
            return Config.PING_GROUPS.includes(role.name);
        });

        let roleIndex = 0;
        await interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setColor('Green')
                    .setTitle('Success')
                    .setDescription(
                        newRoles?.size == 0
                            ? 'All roles removed'
                            : `Roles Updated to: ${newRoles
                                  ?.map((role: Role) => {
                                      roleIndex++;
                                      return `\n(${roleIndex}) ${role.name}`;
                                  })
                                  .join('')}`
                    ),
            ],
            ephemeral: true,
        });
    }

}
