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

const {MessageEmbed} = require("discord.js");
const {Command} = require('../command');

module.exports = class extends Command {
  name = 'argtest';
  description = 'Display passed arguments.';
  usage = '<your arguments here>';
  help =
      "Provide this command with any arguments you wish, and it will return the parsed representation of your arguments.";
  async execute(message, args) {
    let reply = new MessageEmbed();
    reply.setTitle("Passed Arguments");
    for (const k in args) {
      if (k == '_') {
        if (!args[k].length) {
          // No positional arguments
          continue;
        }
        let val = "";
        for (const v of args[k]) {
          val += `• ${v}\n`;
        }
        reply.addField("Positional Arguments", val);
      } else {
        reply.addField(k, args[k], true);
      }
    }
    return message.reply(reply);
  }
};
