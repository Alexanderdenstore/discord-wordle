import { SlashCommandBuilder, CommandInteraction, Client, ClientOptions, Collection } from 'discord.js';

export const DAILY_ATTEMPTS = 4;

export class Bot extends Client {
    commands: Collection<string, any>;
    constructor(options: ClientOptions) {
      super(options);
      this.commands = new Collection();
    }
  }

export type BotCommand = {
    data: SlashCommandBuilder,
    execute: (interaction: CommandInteraction) => Promise<void>
}

export type BotEvent = {
    name: string,
    once?: boolean,
    execute: (c: Bot | CommandInteraction) => Promise<void>
}

export type GameState = {
    currentWord: string,
    completed: boolean,
    completedAt?: Date,
    winnerId?: string
}

export enum LetterPosition {
    INCORRECT,
    CORRECT,
    INCORRECT_BUT_INCLUDED,
}

export type Letter = {
    letter: string,
    position: LetterPosition
}

export type GameResult = {
    letters: Letter[],
    correct: boolean
}