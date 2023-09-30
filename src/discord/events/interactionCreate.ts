import { Events, CommandInteraction } from 'discord.js';
import { Bot, BotEvent } from '../../types';


export default <BotEvent> {
    name: Events.InteractionCreate,
    async execute(interaction: CommandInteraction) {
        if (!interaction.isChatInputCommand()) return;

        const bot = interaction.client as Bot;
        
        const command = bot.commands.get(interaction.commandName);
      
        if (!command) return;
      
        try {
          command.execute(interaction);
        } catch (error) {
          console.error(error);
        }
    },
};