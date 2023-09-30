import { SlashCommandBuilder, CommandInteraction } from 'discord.js';

import { addUserAttempt } from '../../db'
import { checkGuess, currentGameState } from '../../game'
import { BotCommand, DAILY_ATTEMPTS, GameResult, GameState } from '../../types';
import { positionToEmoji } from '../../utilities';


const createResultsEmbed = (result: GameResult, attempts: Number) => {
	let fieldName = "";
	let fieldValue = "```";

	result.letters.forEach((letter) => {
		fieldName += positionToEmoji[letter.position] || ":black_large_square:   ";
		fieldValue += `${letter.letter}  `;
	});
	
	fieldValue += "```";

	return {
		fields: [
			{
				name: fieldName,
				value: fieldValue,
			},
		],
		footer: {
			text: `${attempts}/${DAILY_ATTEMPTS}`,
		},
	};
}

const createCompletedEmbed = (gameState: GameState, avatarUrl: string) => {
	return {
		title: 'Wordle - Completed',
		description: `<@${gameState.winnerId}> already won! 🎉`,
		thumbnail: {
			url: avatarUrl,
		},
		fields: [
			{
				name: 'The word was:',
				value: `**${gameState.currentWord}**`,
			},
		],
		timestamp: gameState.completedAt?.toISOString(),
	};
}

const createWinnerEmbed = (word: string, attempts: Number) => {
	return {
		title: `🍻 ${word.toUpperCase()} 🍻`,
		description: `🎉 Congratulations! You guessed the correct word in ${attempts} tries! 🎉`,
	};
}


export default<BotCommand> {
	data: new SlashCommandBuilder()
		.setName('guess')
		.setDescription('Make a guess for todays word!')
		.addStringOption((option: any) =>
			option.setName('guess')
				.setDescription('Your guess for todays word')
				.setRequired(true)),
	async execute(interaction: CommandInteraction) {

		const gameState = currentGameState()

		if (gameState.completed) {
			const memberCache = interaction.guild?.members.cache
			const getAvatarId = memberCache?.get(gameState.winnerId || '')?.user.avatarURL() || ''
			await interaction.reply({ embeds: [createCompletedEmbed(gameState, getAvatarId)] });
			return
		}

		const wordGuess = interaction.options.getString('guess');

		if (!wordGuess || wordGuess.length < gameState.currentWord.length) {
			return await interaction.reply(`Please provide a guess of at least ${gameState.currentWord.length} characters!`);
		}

		const result = checkGuess(wordGuess, interaction.user.id)

		let attemptCount = 0

		try {
			attemptCount = await addUserAttempt(interaction.user.id, interaction.user.username, result.correct)
		}
		catch (e) {
			console.error(e)
			return await interaction.reply('Something went wrong, please try again later! 😭');
		}

		if (result.correct && attemptCount < DAILY_ATTEMPTS) {
			return await interaction.reply(
				{ embeds: [createResultsEmbed(result, attemptCount), createWinnerEmbed(gameState.currentWord, attemptCount)] }
			);
		}

		if (attemptCount >= DAILY_ATTEMPTS) {
			return await interaction.reply({ content: 'You have used all your attempts for today! 😭', ephemeral: true });
		}

		// The game is still going, so we can just reply with the results
		return await interaction.reply({ embeds: [createResultsEmbed(result, attemptCount)] });
	},
};