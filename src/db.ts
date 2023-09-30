import { PrismaClient } from "@prisma/client";
import { shuffleArray } from "./utilities";
import { DAILY_ATTEMPTS } from "./types";

const prisma = new PrismaClient();

export const addUserAttempt = async (discordId: string, discordName: string, increasePoints: boolean) => {
    
    const user = await prisma.user.upsert({
        create: { discordId: discordId, discordName: discordName },
        update: {},
        where: { discordId: discordId },
    });

    if (user.dailyAttempts >= DAILY_ATTEMPTS) {
        console.log(`User ${discordName} has already used all their attempts today!`)
        return user.dailyAttempts
    }


        const updatedUser = await prisma.user.update({
            where: { discordId: discordId },
            data: { dailyAttempts: { increment: 1 }, points: { increment: increasePoints ? 1 : 0 } },
        });
        return updatedUser.dailyAttempts
}

export const getUser = async (discordId: string) => {
    try {
        const user = await prisma.user.findUnique({
            where: { discordId: discordId }
        })

        return user
    }
    catch (error) {
        throw error
    }
}

export const getLeaderboard = async () => {
    try {
        const leaderboard = await prisma.user.findMany({
            orderBy: {
                dailyAttempts: 'desc'
            },
            take: 5
        })

        return leaderboard
    }
    catch (error) {
        throw error
    }
}

export const resetUserAttempts = async () => {
    try {
        await prisma.user.updateMany({
            data: { dailyAttempts: 0 }
        })
    }
    catch (error) {
        throw error
    }
}

export const getSecretWord = async () => {
    let firstEntry = await prisma.word.findFirst()
    
    if (firstEntry === null) {
        console.log("No words in database, randomizing new ones!")
        addWordList(shuffleArray(await getWordList()))

        firstEntry = await prisma.word.findFirst()
        if (firstEntry === null) {
            throw new Error("No words in database, and failed to randomize new ones!")
        }
    }

    try {
        const secretWord = await prisma.word.delete({
            where: { id: firstEntry.id }
        })

        return secretWord.content
    }
    catch (error) {
        throw error
    }
}

const addWordList = async (wordList: string[]) => {
    try {
        // prisma.createMany is not supported by SQLite
        wordList.forEach(async (word: string) => {
            await prisma.word.create({
                data: { content: word }
            })
        })
    }
    catch (error) {
        throw error
    }
}

const getWordList = async () => {
    const wordFile = Bun.file('wordlist.txt');
    const words = await wordFile.text()

    const wordList = words.split('\n')
    return wordList
}

export default prisma;