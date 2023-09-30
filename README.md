# Discord Wordle

A very simple wordle clone made in discord.

## Description

Weekend project mainly to test some of bun.js features.

## Getting Started

### Dependencies

To install dependencies:

```bash
bun install
```

### Installing

- Rename **.env.template** file to **.env** and fill in the discord id's

To initialize a sqlite database:

```bash
bun run init-prisma
```

To register commands to the discord server:

```bash
bun run deploy-commands
```

### Executing program

- To run

```bash
bun run start
```

This project was created using `bun init` in bun v1.0.3. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.
