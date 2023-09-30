import { GatewayIntentBits } from 'discord.js';
import { BotCommand, BotEvent } from '../types';
import { importDirectory } from '../utilities';

import { Bot } from '../types';

export const discordClient = new Bot({intents: [GatewayIntentBits.Guilds]});

// Load Commands
await importDirectory('discord/commands', (command: BotCommand) => {
    if (!command.data || !command.execute) {
        throw new Error(`Invalid command file structure ${command}`);
    }

    discordClient.commands.set(command.data.name, command);
});

// Load Events
await importDirectory('discord/events', (event: BotEvent) => {
    if (event.once) {
      discordClient.once(event.name, (...args: any) => event.execute(...args));
    } else {
      discordClient.on(event.name, (...args: any) => event.execute(...args));
    }
});