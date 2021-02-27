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
const { makeHandler } = require("../helpers");

module.exports = {
  command: "serverinfo",
  aliases: ["server"],
  describe: "Retrieve information about this server",
  builder: {},
  handler: makeHandler(
    (argv) => {
      const guild = argv.message.guild;
      guild.fetch();
      const reply = new MessageEmbed();
      reply.setTitle(guild.name);
      reply.setThumbnail(guild.iconURL());
      reply.setImage(guild.bannerURL());
      if (guild.description) reply.setDescription(guild.description);
      reply.addField("Owner", guild.owner.user.tag, true);
      reply.addField("Members", guild.memberCount, true);
      reply.addField("Created at", guild.createdAt, true);
      reply.addField("Server Region", guild.region, true);
      reply.addField("Preferred Language", guild.preferredLocale, true);
      reply.addField(
        "Total Server Boosts",
        guild.premiumSubscriptionCount,
        true
      );
      if (guild.premiumTier > 0)
        reply.addField("Premium Tier", guild.premiumTier, true);

      argv.message.reply(reply);
    },
    {
      serverOnly: true,
    }
  ),
};
