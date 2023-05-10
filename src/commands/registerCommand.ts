import SlashCommand from "../types/Command";
import {CommandInteraction, SlashCommandBuilder} from "discord.js";
import userModel from "../models/user.model";
import axios from "axios";
import {findGuildMemberByDiscordID} from "../utils/findGuildMember";
import {Config} from "../core/config";
import {dangerEmbed} from "../embeds/default/dangerEmbed";
import {successEmbed} from "../embeds/default/successEmbed";

export default class RegisterCommand extends SlashCommand {
    constructor() {
        super('register');
    }

    async run(interaction: CommandInteraction): Promise<void> {
        try {
            await interaction.deferReply({ephemeral: true});

            const _user = await userModel.findOne({
                discordId: interaction.user.id
            });

            if (_user == null || _user.cid == null)
                throw new Error("User with discord ID " + interaction.user.id + " is not in the database or the CID is not present");

            const res = await axios.get("http://hp.vatsim-germany.org/api/account/" + _user.cid + "/isger");
            const isVatger = res.data as boolean;

            // If this is already the saved state, then we already assigned roles, etc.
            if (isVatger == _user.isVatger) {
                await interaction.followUp({
                    embeds: [dangerEmbed(
                        "Register Failed",
                        null,
                        "You are already registered. No changes to your account have been made"
                    )],
                    ephemeral: true
                });
                return;
            }

            await userModel.updateOne({
                discordId: _user.discordId,
                cid: _user.cid
            }, {
                $set: {
                    isVatger: isVatger
                }
            });

            const guildMember = await findGuildMemberByDiscordID(interaction.user.id);

            if (isVatger)
                await guildMember?.roles.add(Config.VATGER_MEMBER_ROLE_ID);
            else
                await guildMember?.roles.remove(Config.VATGER_MEMBER_ROLE_ID);

            await interaction.followUp({
                embeds: [successEmbed(
                    "Registered Successfully",
                    null,
                    "You have registered successfully and have received the VATGER-Member Role!"
                )]
            });
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