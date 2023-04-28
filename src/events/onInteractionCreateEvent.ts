import DiscordEvent from "../types/Event";
import {CommandInteraction, Events, Interaction, StringSelectMenuInteraction} from "discord.js";
import {CommandList} from "../index";

export default class OnInteractionCreateEvent extends DiscordEvent {
    constructor() {
        super(Events.InteractionCreate);
    }

    async run(interaction: Interaction)
    {
        if (interaction.isChatInputCommand()) {
            const name: string = interaction.commandName;
            console.log("Running Chat Input Interaction: ", name);
            await CommandList.get(name)?.run(<CommandInteraction>interaction);
            return;
        }

        if (interaction.isStringSelectMenu()) {
            const name: string = interaction.customId;
            console.log("Running String Select Menu Interaction: ", name);

            await CommandList.get(name)?.run(<StringSelectMenuInteraction>interaction);
            return;
        }
    }
}