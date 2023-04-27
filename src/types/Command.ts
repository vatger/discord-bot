import {
    CommandInteraction,
} from "discord.js";

export default class SlashCommand {
    name: string;

    constructor(name: string) {
        this.name = name;
    }

    async run(interaction: CommandInteraction) {
        throw new Error("Interaction Handler not implemented");
    }

    build(): any {
        throw new Error("Commandbuilder not implemented")
    }
}