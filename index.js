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

const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config'); // Bot config
const Yargs = require("yargs");

const client = new Discord.Client();
const yargs = new Yargs();
yargs.scriptName("VIP Bot");

// Load commands:
console.info("Loading commands");
yargs.commandDir("commands", {
  recurse : true,
  visit(cmd, path) {
    console.info(`Found command: ${cmd.command} - ${cmd.describe} in ${path}`);
    return cmd;
  },
});

client.once('ready',
            () => { console.info(`Logged in as ${client.user.username}`); });

client.on('message', message => {
  // Ignore messages from bots or not directed at us
  if (!message.content.startsWith(config.prefix) || message.author.bot)
    return;
  const rawArgs = message.content.slice(config.prefix.length);
  return yargs.parse(
      rawArgs, {
        message,
      },
      (err, argv, output) => {
        if (output)
          argv.message.channel.send(output);
        if (err) {
          console.error(`Error in command: ${argv.message.content}`)
          console.error(err);
          return message.reply(
              config.debug ? `Error:\n${err}`
                           : "Sorry, that command encountered an error.");
        }
      });
});

client.login(config.token);
