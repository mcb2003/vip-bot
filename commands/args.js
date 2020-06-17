const Command = require('../command');

module.exports = class extends Command {
    name = 'argtest';
    description = 'Display passed arguments.';
    execute(message, args) {
        let reply = "**Passed Arguments:**\n\n";
        for(let k in args) {
            reply += `**${k}:**\t${args[k]}\n`;
        }
        return message.reply(reply);
    }
};
