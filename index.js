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

const client = new Discord.Client();

// Default command argument config.
const defaultArgConfig = {
  configuration : {
    'strip-aliased' : true,
    'strip-dashed' : true,
  },
  alias : {help : [ 'h' ]},
  boolean : [ 'help' ]
};

// Load commands:
console.info("Loading commands");
client.commands = new Discord.Collection();
const commandFiles =
    fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  console.info(`Found command file: ${file}`);
  const CommandClass = require('./commands/' + file);
  const command = new CommandClass(config, defaultArgConfig);
  client.commands.set(command.name.toLowerCase(), command);
  console.info(`Loaded command: ${command.name} - ${command.description}`);
}

client.once('ready',
            () => { console.info(`Logged in as ${client.user.username}`); });

client.on('message', message => {
  // Ignore messages from bots or not directed at us
  if (!message.content.startsWith(config.prefix) || message.author.bot)
    return;
  const rawArgs = message.content.slice(config.prefix.length)
                      .split(/[ \t\n]+/); // Might add quoting rules later
  const commandName = rawArgs.shift().toLowerCase();
  if (client.commands.has(commandName)) {
    const command = client.commands.get(commandName);
    try {
      return command.run(message, rawArgs);
    } catch (e) {
      return message.reply(`Sorry, there was an error running that command:\n${
          e.name}: ${e.message}`);
      console.error(e);
    }
  } else if (config.replyCNF) { // reply on command not found
    return message.reply(`That command doesn't exist. Type "${
        config.prefix}help" to get a list of commands.`);
  }
});

client.login(config.token);
