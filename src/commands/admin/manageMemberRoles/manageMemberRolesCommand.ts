import SlashCommand from '../../../types/Command';
import {
    SlashCommandBuilder,
    User,
    ChatInputCommandInteraction,
    RoleSelectMenuBuilder,
    ActionRowBuilder,
    APIRole,
    RoleSelectMenuInteraction, GuildMember, Message,
} from 'discord.js';
import {dangerEmbed} from '../../../embeds/default/dangerEmbed';
import {findGuildMemberByDiscordID} from "../../../utils/findGuildMember";
import {successEmbed} from "../../../embeds/default/successEmbed";

const roleSelect = new RoleSelectMenuBuilder()
    .setCustomId("roles")
    .setMinValues(1)
    .setMaxValues(5);

const actionRow = new ActionRowBuilder<RoleSelectMenuBuilder>()
    .addComponents(roleSelect)

const disallowedRoles = [
    "Serveradmin",
    "VATGER Staff",
    "Bots",
    "..."
]

export default class ManageMemberRolesCommand extends SlashCommand {
    constructor() {
        super('managememberroles');
    }

    async run(interaction: ChatInputCommandInteraction) {
        let answer;
        let roleSelectionMessage;

        try {
            answer = await interaction.deferReply({ephemeral: true});

            const user: User | null = interaction.options.getUser("user");

            const message: Message<boolean> = await interaction.followUp({
                components: [actionRow],
                ephemeral: true
            });

            try {
                const collectorFilter = (i: any) => i.user.id == interaction.user.id;
                roleSelectionMessage = await message.awaitMessageComponent({
                    filter: collectorFilter,
                    time: 60_000
                });

                const roles: string[] = (<RoleSelectMenuInteraction>roleSelectionMessage).roles.filter(r => {
                    return !disallowedRoles.includes(r.name);
                }).map((r) => r.id);

                const guildMember: GuildMember | undefined = await findGuildMemberByDiscordID(user?.id);
                guildMember?.roles.add(roles);

                await interaction.editReply({
                    embeds: [successEmbed("Roles Assigned", null, "The roles were added to the user")],
                    components: []
                });
            } catch (e: any) {
                await answer.edit({
                    components: []
                });
            }

        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('Manage Member Roles failed', null, e.message)],
                ephemeral: true,
            });
            return;
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("test")
            .addUserOption(option =>
                option
                    .setName("user")
                    .setDescription("t")
                    .setRequired(true)
            );
    }
}
