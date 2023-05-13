import { Client, Events } from 'discord.js';

export default class DiscordEvent {
    event: Events;

    constructor(event: Events) {
        this.event = event;
    }

    async run(...any: any[]) {
        throw new Error('Not implemented');
    }

    register(client: Client) {
        client.on(this.event.toString(), this.run);
    }

    unRegister(client: Client) {
        client.removeListener(this.event.toString(), this.run);
    }
}
