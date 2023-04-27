import SlashCommand from "../../types/Command";
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    User,
    ChatInputCommandInteraction, Channel, TextChannel
} from "discord.js";
import {errorEmbed} from "../../embeds/errorEmbed";
import {successEmbed} from "../../embeds/successEmbed";
import {BotClient} from "../../core/client";
import {banEmbed} from "../../embeds/admin/banEmbed";

export default class KickCommand extends SlashCommand {
    constructor() {
        super("ban");
    }

    async run(interaction: ChatInputCommandInteraction)
    {
        const user: User | null = interaction.options.getUser("target");
        const reason: string | null = interaction.options.getString("reason");

        if (user == null)
        {
            await interaction.reply({
                embeds: [errorEmbed("Failed to resolve User: null provided")],
                ephemeral: true
            });
            return;
        }

        await interaction.guild?.members.ban(user, {reason: reason ?? undefined});
        await interaction.reply({
            embeds: [successEmbed(`User ${user.username}#${user.discriminator} successfully banned! \n\n **Reason:** ${reason ?? "N/A"}`)],
            ephemeral: true
        });

        const channel: Channel | undefined = BotClient.channels.cache.get("1062285471654359111");
        if (channel == null)
        {
            console.log("Tried to send ban message in channel, but not found! Channel-ID: ", "id");
            return;
        }

        await (<TextChannel>channel).send({
            embeds: [banEmbed(user, interaction.user, reason)]
        });
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Bans the specified user")
            .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
            .setDMPermission(false)
            .addUserOption(user =>
                user
                    .setName("target")
                    .setDescription("The member to ban")
                    .setRequired(true)
            )
            .addStringOption(string =>
                string
                    .setName("reason")
                    .setDescription("Reason of ban")
                    .setRequired(false)
            );
    }
}