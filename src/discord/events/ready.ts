import { Events, Client } from 'discord.js';
import { BotEvent } from '../../types';
import { resetWord } from '../../game';

const cron = require('node-cron');

export default <BotEvent> {
    name: Events.ClientReady,
    once: true,
    async execute(c: Client) {
        console.log(`Ready! logged in as ${c.user?.tag}`);

        await resetWord();

        cron.schedule('0 15 * * *', async () => {
            await resetWord();
        });
    },
};