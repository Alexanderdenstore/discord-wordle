import { discordClient } from "./src/discord/bot";

discordClient.login(process.env.DISCORD_TOKEN)