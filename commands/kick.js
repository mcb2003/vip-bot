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

const { MessageEmbed } = require("discord.js");
const {
  makeHandler,
  getUserFromMention,
  getUserFromTag,
} = require("../helpers");

module.exports = {
  command: "kickuser <user> [reason]",
  aliases: ["kick", "k"],
  describe: "Kick a user from this server",
  builder(yargs) {
    return yargs
      .positional("user", {
        describe: "The user to kick",
      })
      .positional("reason", {
        describe: "The reason for kicking this user (appears in the audit log)",
        type: "string",
      });
  },
  handler: makeHandler(
    (argv) => {
      if (!argv.user) return argv.message.reply("That user doesn't exist.");
      if (!argv.message.member.permissions.has("KICK_MEMBERS"))
        return argv.message.reply("You don't have permission to kick members.");

      let member = argv.message.guild.member(argv.user);
      if (!member)
        return argv.message.reply(
          `${argv.user} is not a member of this server.`
        );
      if (!member.kickable)
        return argv.message.reply(`You can't kick ${argv.user}`);

      member
        .kick(argv.reason)
        .then(() => {
          argv.message.reply(`Successfully kicked ${argv.user}`);
        })
        .catch((e) => {
          argv.message.reply(
            argv.config.debug
              ? `Failed to kick ${argv.user}: ${e}`
              : `Failed to kick ${argv.user}`
          );
        });
    },
    {
      serverOnly: true,
      users: ["user"],
      defaultToSelf: true,
    }
  ),
};
