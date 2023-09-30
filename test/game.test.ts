import { expect, test } from "bun:test";
import { checkGuess, setCurrentWord, currentGameState } from "../src/game";

const DISCORD_ID = "123456";

test("set correct current word 'apple'", () => {
    const gameState = setCurrentWord("apple");
    expect(gameState.currentWord).toEqual("apple");
});

test("check guess 'apple'", () => {
    const result = checkGuess("apple");
    expect(result.correct).toEqual(true);
});

test("check discord winner id", () => {
    const result = checkGuess("apple", DISCORD_ID);
    
    const gameState = currentGameState();
    expect(gameState.winnerId).toEqual(DISCORD_ID);
});

test("set incorrect current word 'apple'", () => {
    const gameState = setCurrentWord("apple");
    expect(gameState.currentWord).not.toEqual("banana");
});