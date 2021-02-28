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

// Get an id from a mention of any type
exports.id = (id) => {
  if (!id) return;
  const matches = id.match(/^<(#|(@[!&]?))(\d+)>$/);
  if (matches && matches.length >= 4) return matches[3];
};

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
  const id = exports.id(mention);
  return client.users.cache.get(id);
};

exports.getUserFromTag = (client, tag) => {
  if (!client || !tag) return;
  return client.users.cache.find((u) => u.tag == tag);
};
