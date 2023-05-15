import {
    CommandInteraction,
    StringSelectMenuInteraction,
    ButtonInteraction, RoleSelectMenuInteraction,
} from 'discord.js';

export default class SlashCommand {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    async run(
        interaction:
            | CommandInteraction
            | StringSelectMenuInteraction
            | RoleSelectMenuInteraction
            | ButtonInteraction
    ) {
        throw new Error('Interaction Handler not implemented');
    }

    build(): any {
        return null;
    }
}
