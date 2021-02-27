/*
    VIP Bot - Yet another Discord bot!

    Copyright (c) 2020 Michael Connor Buchan

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to
   deal in the Software without restriction, including without limitation the
   rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
   sell copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in
   all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
   FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
   IN THE SOFTWARE.
*/

const { name, version, bugs } = require("./package.json");
const fs = require("fs");
const Discord = require("discord.js");
const config = require("./config"); // Bot config
const Yargs = require("yargs");

const client = new Discord.Client();
const yargs = new Yargs()
  .fail(false)
  .version(false)
  .help()
  .recommendCommands()
  .scriptName(config.prefix)
  .scriptName(config.prefix)
  .epilogue(`Report bugs at ${bugs.url}`);

// Load commands:
console.info("Loading commands");
yargs.commandDir("commands", {
  recurse: true,
  visit(cmd, path) {
    console.info(`Found command: ${cmd.command} - ${cmd.describe} in ${path}`);
    if (cmd.disabled) {
      console.info(`${cmd.command} is disabled, not loading it`);
      return null;
    }
    return cmd;
  },
});

// The default command (handles command not found)
yargs.command("*", false, {}, (argv) => {
  // Handle command not found
  if (config.replyCNF && argv._.length > 0)
    return argv.message.reply(`${argv._[0]}: command not found`);
  // Don't do anything else, so no output is generated
});

// Version command
yargs.command("version", "Get the bot's version", {}, (argv) => {
  return argv.message.channel.send(`${name} version ${version}`);
});

// The error handler
function handleError(err, msg) {
  console.error(`Error in command: ${msg.content}`);
  console.error(err);
  return msg.reply(
    config.debug
      ? `Error:\n${err}`
      : "Sorry, that command encountered an error."
  );
}

client.once("ready", () => {
  console.info(`Logged in as @${client.user.tag}`);
});

client.on("message", async (message) => {
  // Ignore messages from bots or not directed at us
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const rawArgs = message.content.slice(config.prefix.length);

  try {
    // Execute the command
    yargs.locale(
      message.author.locale ?? message.guild.preferredLocale ?? "en-US"
    );
    await yargs.parse(
      rawArgs,
      {
        message,
        config,
      },
      (err, argv, output) => {
        if (output)
          // Yargs has output for the user (probably help or an
          // argument error)
          argv.message.channel.send(output);
        if (err) {
          handleError(err, message);
        }
      }
    );
  } catch (e) {
    console.error(e);
  }
});

client.login(config.token);
