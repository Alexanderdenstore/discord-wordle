import path from 'path';
import fs from 'fs';

import { REST, Routes, RESTPostAPIChatInputApplicationCommandsJSONBody } from 'discord.js';
import { importDirectory } from '../utilities';
import { BotCommand } from '../types';

const commands: RESTPostAPIChatInputApplicationCommandsJSONBody[] = []

await importDirectory('discord/commands', (command: BotCommand) => {
    if (!command.data || !command.execute) {
        throw new Error(`Invalid command file structure ${command}`);
    }

    commands.push(command.data.toJSON());
});

const rest = new REST().setToken(process.env.DISCORD_TOKEN??"");
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');

        await rest.put(
            Routes.applicationGuildCommands(process.env.DISCORD_CLIENT_ID??"", process.env.DISCORD_GUILD_ID??""),
            { body: commands },
        );

        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
})();