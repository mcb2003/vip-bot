/*
    VIP Bot - Yet another Discord bot!

    Copyright (c) 2020-2021 Michael Connor Buchan

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

const { MessageEmbed } = require("discord.js");

module.exports = {
  command: "argtest",
  describe: "Display passed arguments.",
  disabled: true,
  builder(yargs) {
    return yargs.example(
      "$0argtest -s --long-option --value=something --spaced-value test posarg1 posarg2"
    );
  },
  handler(argv) {
    let reply = new MessageEmbed();
    reply.setTitle("Passed Arguments");
    for (const k in argv) {
      if (k == "$0" || k == "message" || k == "config") continue;
      if (k == "_") {
        if (!argv[k].length) {
          // No positional arguments
          continue;
        }
        let val = "• " + argv[k].join("\n• ");
        reply.addField(`Positional Arguments (${argv["_"].length})`, val);
      } else {
        reply.addField(k, argv[k], true);
      }
    }
    return argv.message.reply(reply);
  },
};
