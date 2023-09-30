import { GameResult, GameState, LetterPosition } from "./types";
import { getSecretWord } from "./db";
import { resetUserAttempts } from "./db";

const gameState: GameState = {
    currentWord: "",
    completed: false,
    winnerId: undefined,
    completedAt: undefined
}

export const checkGuess = (guess: string, discordId: string = ""): GameResult => {
    const lowercasedGuess = guess.toLowerCase();
    const slicedGuess = lowercasedGuess.slice(0, gameState.currentWord.length);

    const letters = [...slicedGuess].map((letter, index) => {
        let position = LetterPosition.INCORRECT;
        
        if (gameState.currentWord.includes(letter)) {
            position = (letter === gameState.currentWord[index])
                ? LetterPosition.CORRECT : LetterPosition.INCORRECT_BUT_INCLUDED;
        }

        return {
            letter,
            position
        };
    });

    const isCompleted = slicedGuess === gameState.currentWord;
    if (isCompleted) {
        gameState.completed = true;
        gameState.winnerId = discordId;
        gameState.completedAt = new Date();
    }

    return {
        letters: letters,
        correct: isCompleted
    };
}

export const setCurrentWord = (word: string): GameState => {
    if (!word) throw new Error("No word provided!")

    gameState.currentWord = word
    gameState.completed = false
    console.log(`Secret word is "${gameState.currentWord}"`)
    
    return gameState
}

export const currentGameState = (): GameState => gameState
export const resetWord = async () => {
    setCurrentWord(await getSecretWord())
    await resetUserAttempts()
} 