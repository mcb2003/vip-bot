module.exports = {
    name: 'ping',
    description: 'A test command.',
    execute(message) {
        message.reply('Pong!');
    }
};
