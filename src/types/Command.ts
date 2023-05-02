import { CommandInteraction, StringSelectMenuInteraction, ButtonInteraction } from 'discord.js';

export default class SlashCommand {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    async run(interaction: CommandInteraction | StringSelectMenuInteraction | ButtonInteraction) {
        throw new Error('Interaction Handler not implemented');
    }

    build(): any {
        return null;
    }
}
