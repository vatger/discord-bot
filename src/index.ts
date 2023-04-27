import {Collection, GatewayIntentBits, ActivityType} from "discord.js";
import Command from './types/Command';
import {BotClient} from "./core/client";
import {Config} from "./core/config";
import DiscordEvent from "./types/Event";
import Init from "./core/init";

export const CommandList: Collection<string, Command> = new Collection<string, Command>();
export const EventList: Collection<string, DiscordEvent> = new Collection<string, DiscordEvent>();


Promise.all([Init.loadCommands(), Init.loadEvents()]).then(() => {
    console.log("Commands: ", Array.from(CommandList.keys()));
    console.log("Events: ", Array.from(EventList.keys()));

    BotClient.login(Config.BOT_TOKEN)
        .then(() => {
            console.log("Logged in!");

            BotClient.user?.setActivity({
                type: ActivityType.Listening,
                name: "122.800",
                url: "https://vatger.de"
            });
        });
})