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

// Wrap a command handler to deal with server-only commands, cooldown, perms,
// etc.
exports.makeHandler = (handler, options) => {
  return (argv) => {
    if (options.serverOnly && !argv.message.guild)
      return argv.message.reply("That command is server-only.");
    return handler(argv);
  };
};

exports.getUserFromMention = (client, mention) => {
  if (!client || !mention) return;
  // The id is the first and only match found by the RegEx.
  const matches = mention.match(/^<@!?(\d+)>$/);
  if (!matches || matches.length < 2) return;
  // The first element in the matches array is the entire mention
  const id = matches[1];

  return client.users.cache.get(id);
};

exports.getUserFromTag = (client, tag) => {
  if (!client || !tag) return;
  return client.users.cache.find((u) => {
    console.log(u.tag);
    return u.tag == tag;
  });
};
