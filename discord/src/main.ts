import "reflect-metadata";

import { dirname, importx } from "@discordx/importer";
import {
  Collection,
  Intents,
  Message,
  MessageActionRow,
  MessageButton,
  Snowflake,
  TextChannel,
} from "discord.js";
import { Client } from "discordx";
import { Koa } from "@discordx/koa";
import cors from "@koa/cors";

export const bot = new Client({
  // To only use global commands (use @Guild for specific guild command), comment this line
  botGuilds: [(client) => client.guilds.cache.map((guild) => guild.id)],

  // Discord intents
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
    Intents.FLAGS.GUILD_VOICE_STATES,
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

  // Synchronize applications command permissions with Discord
  await bot.initApplicationPermissions();

  const verifyChannel = <TextChannel>(
    bot.channels.cache.get(`${process.env.VERIFY_CHANNEL_ID}`)
  );

  const verifyButton = await verifyChannel.messages
    .fetch()
    .then((messages: Collection<Snowflake, Message>) =>
      messages.find(
        (message) =>
          message.author.bot === true &&
          message.author.discriminator === process.env.DISCORD_BOT_ID
      )
    );

  if (verifyButton === undefined) {
    const row = new MessageActionRow().addComponents(
      new MessageButton()
        .setCustomId("primary")
        .setLabel("Verify Now!")
        .setStyle("PRIMARY")
    );

    verifyChannel.send({
      components: [row],
    });
  }

  // To clear all guild commands, uncomment this line,
  // This is useful when moving from guild commands to global commands
  // It must only be executed once
  //
  //  await bot.clearApplicationCommands(
  //    ...bot.guilds.cache.map((g) => g.id)
  //  );

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
  if (!process.env.DISCORD_BOT_TOKEN) {
    throw Error("Could not find DISCORD_BOT_TOKEN in your environment");
  }

  // Log in with your bot token
  await bot.login(process.env.DISCORD_BOT_TOKEN);

  // ************* rest api section: start **********

  // api: prepare server
  const app = new Koa();

  // api: need to build the api server first
  await app.build();
  app.use(cors());
  
  // api: let's start the server now
  const port = process.env.PORT ?? 7000;
  app.listen(port, () => {
    console.log(`discord api server started on ${port}`);
    console.log(`visit localhost:${port}/guilds`);
  });
  // ************* rest api section: end **********
}

run();
