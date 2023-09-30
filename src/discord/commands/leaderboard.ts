import { SlashCommandBuilder, CommandInteraction, EmbedBuilder } from 'discord.js';
import { getLeaderboard, getUser } from '../../db';

export default {
	data: new SlashCommandBuilder()
		.setName('leaderboard')
		.setDescription('Displays the current leaderboard.'),
	async execute(interaction: CommandInteraction) {

		const leaderboard = await getLeaderboard()
		const currentUser = await getUser(interaction.user.id)

		const embed = new EmbedBuilder()
      					.setTitle('Leaderboard')
      					.setDescription('Top 5 🤩')
      					.setColor(0x0099ff);

		embed.addFields(leaderboard.map((user, index) => {
			return {
				name: `#${index + 1} ${user.discordName}`,
				value: `${user.points} points`,
				inline: true
			}
		}));

		embed.setFooter({ text: `You have ${currentUser?.points} points ✨`})

		await interaction.reply({ embeds: [embed] });
	},
};