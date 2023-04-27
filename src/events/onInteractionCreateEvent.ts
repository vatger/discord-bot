import DiscordEvent from "../types/Event";
import {CommandInteraction, Events, Interaction} from "discord.js";
import {CommandList} from "../index";

export default class OnInteractionCreateEvent extends DiscordEvent {
    constructor() {
        super(Events.InteractionCreate);
    }

    async run(interaction: Interaction)
    {
        if (!interaction.isChatInputCommand())
            return;

        const name: string = interaction.commandName;

        await CommandList.get(name)?.run(<CommandInteraction>interaction);
    }
}