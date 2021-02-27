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
  command: "userinfo [user]",
  aliases: ["user", "memberinfo", "member"],
  describe: "Retrieve information about yourself or a specific Discord user",
  builder(yargs) {
    return yargs.positional("user", {
      describe: "The user to retrieve information about (you by default)",
    });
  },
  handler: makeHandler(
    (argv) => {
      let user;
      if (argv.user) {
        // Fetch the user
        user =
          getUserFromMention(argv.message.client, argv.user) ??
          getUserFromTag(argv.message.client, argv.user);
      } else {
        user = argv.message.author;
      }
      let member;
      if (user) {
        member = argv.message.guild.member(user);
      } else {
        return argv.message.reply("That user doesn't exist");
      }
      if (member) {
        const reply = new MessageEmbed();
        reply.setTitle(`${user.tag} (${member.presence.status})`);
        reply.setColor(member.displayColor);
        reply.setThumbnail(user.displayAvatarURL());
        if (member.nickname) reply.addField("Nickname", member.nickname, true);
        reply.addField("Joined Discord", user.createdAt, true);
        reply.addField("Joined This Server", member.joinedAt, true);
        if (member.premiumSince)
          reply.addField("Boosted this server", member.premiumSince, true);
        reply.addField("Bot", user.bot ? "Yes" : "No", true);
        if (member.voice.channel)
          reply.addField("In Voice Channel", member.voice.channel, true);

        // Debug only info
        if (argv.config.debug) {
          reply.addField("Id", member.id, true);
          reply.addField("bannable", member.bannable ? "Yes" : "No", true);
          reply.addField("Kickable", member.kickable ? "Yes" : "No", true);
        }

        argv.message.reply(reply);
      } else argv.message.reply("That user isn't a member of this server");
    },
    {
      serverOnly: true,
    }
  ),
};
