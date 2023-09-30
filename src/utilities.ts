import path from 'path';
import fs from 'fs';

import { LetterPosition } from './types';

export const importDirectory = async (dirName: string, onFile: any) => {
    const dirPath = path.join(__dirname, dirName);
    const files = fs.readdirSync(dirPath).filter((file: string) => file.endsWith('.ts'));
    for (const file of files) {
        const fullPath = path.join(dirPath, file);
        const { default: defaultImport} = await import(fullPath);

        onFile && onFile(defaultImport)
    }
}

export const shuffleArray = (array: string[]) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (array.length));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array
}

export const positionToEmoji = {
	[LetterPosition.CORRECT]: ":green_square:   ",
	[LetterPosition.INCORRECT_BUT_INCLUDED]: ":yellow_square:   ",
	[LetterPosition.INCORRECT]: ":black_large_square:   "
};