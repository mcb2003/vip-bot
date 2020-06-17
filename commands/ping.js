const Command = require('../command');

module.exports = class extends Command {
    name = 'ping';
    description = 'A test command.';
    execute(message) {
        message.reply('Pong!');
    }
};
