import SlashCommand from "../types/Command";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import {dangerEmbed} from "../embeds/default/dangerEmbed";
import {successEmbed} from "../embeds/default/successEmbed";
import userService from "../services/user.service";

export default class RegisterCommand extends SlashCommand {
    constructor() {
        super('register');
    }

    async run(interaction: CommandInteraction): Promise<void> {
        try {
            await interaction.deferReply({ephemeral: true});

            const isVatger = await userService.checkIsVatger(interaction.user.id);

            if (isVatger) {
                await interaction.followUp({
                    embeds: [successEmbed(
                        "Registered Successfully",
                        null,
                        "You have registered successfully and have received the VATGER-Member Role!"
                    )]
                });
            } else {
                await interaction.followUp({
                    embeds: [dangerEmbed(
                        "Not Registered",
                        null,
                        "You are not a member of at least one regional group (guest or full member)"
                    )]
                });
            }
        } catch (e: any) {
            await interaction.followUp({
                embeds: [dangerEmbed('Register failed', null, e.message)],
                ephemeral: true,
            });
        }
    }

    build(): any {
        return new SlashCommandBuilder()
            .setName(this.name)
            .setDescription("Grants the VATGER-Member role if you are member of at least one regional-group!");
    }
}