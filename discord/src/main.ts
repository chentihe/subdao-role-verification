import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import { Koa } from "@discordx/koa";
import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
} from "discord.js";
import { IntentsBitField } from "discord.js";
import { Client } from "discordx";
import dotenv from "dotenv";

dotenv.config();

export const bot = new Client({
  // To only use global commands (use @Guild for specific guild command), comment this line
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.GuildMessageReactions,
    IntentsBitField.Flags.GuildVoiceStates,
  ],

  // Debug logs are disabled in silent mode
  silent: false,

  // Configuration for @SimpleCommand
  simpleCommand: {
    prefix: "!",
  },
});

bot.once("ready", async () => {
  // Make sure all guilds are cached
  await bot.guilds.fetch();

  // Synchronize applications commands with Discord
  await bot.initApplicationCommands();

  const verifyChannel = <TextChannel>(
    bot.channels.cache.get(`${process.env.VERIFY_CHANNEL_ID}`)
  );

  const verifyButton = await verifyChannel.messages.fetch().then((messages) => {
    return messages.find(
      (message) =>
        message.author.bot &&
        message.author.discriminator === process.env.BOT_ID
    );
  });

  if (verifyButton === undefined) {
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("primary")
        .setLabel("Verify Now!")
        .setStyle(ButtonStyle.Primary)
    ) as any;

    verifyChannel.send({
      components: [row],
    });
  }

  console.log("Bot started");
});

async function run() {
  // The following syntax should be used in the commonjs environment
  //
  // await importx(__dirname + "/{events,commands,api}/**/*.{ts,js}");

  // The following syntax should be used in the ECMAScript environment
  await importx(
    dirname(import.meta.url) + "/{events,commands,api}/**/*.{ts,js}"
  );

  // Let's start the bot
  if (!process.env.BOT_TOKEN) {
    throw Error("Could not find BOT_TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(process.env.BOT_TOKEN);

  // ************* rest api section: start **********

  // api: prepare server
  const server = new Koa();

  // api: need to build the api server first
  await server.build();

  // api: let's start the server now
  const port = process.env.PORT ?? 7000;
  server.listen(port, () => {
    console.log(`discord api server started on ${port}`);
    console.log(`visit localhost:${port}/guilds`);
  });

  // ************* rest api section: end **********
}

run();
