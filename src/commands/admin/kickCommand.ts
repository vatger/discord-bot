import SlashCommand from "../../types/Command";
import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    User,
    ChatInputCommandInteraction, Channel, TextChannel
} from "discord.js";
import {errorEmbed} from "../../embeds/errorEmbed";
import {successEmbed} from "../../embeds/successEmbed";
import {DiscordBotClient} from "../../core/client";
import {kickEmbed} from "../../embeds/admin/kickEmbed";

export default class KickCommand extends SlashCommand {
    constructor() {
        super("kick");
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

        //await interaction.guild?.members.kick(user, reason ?? undefined);
        await interaction.reply({
            embeds: [successEmbed(`User ${user.username}#${user.discriminator} successfully kicked! \n\n **Reason:** ${reason ?? "N/A"}`)],
            ephemeral: true
        });

        const channel: Channel | undefined = DiscordBotClient.channels.cache.get("1062285471654359111");
        if (channel == null)
        {
            console.log("Tried to send kick message in channel, but not found! Channel-ID: ", "id");
            return;
        }

        await (<TextChannel>channel).send({
            embeds: [kickEmbed(user, interaction.user, reason)]
        });
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Kicks the specified user")
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
                    .setDescription("Reason of kick")
                    .setRequired(false)
            );
    }
}