const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config'); // Bot config

const client = new Discord.Client();

// Load commands:
console.info("Loading commands");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    console.info(`Found command file: ${file}`);
    const command = require('./commands/' + file);
    client.commands.set(command.name, command);
    console.info(`Loaded command: ${command.name} - ${command.description}`);
}

client.once('ready', () => {
	console.info(`Logged in as ${client.user.username}`);
});

client.on('message', message => {
    console.log(`Recieved message: ${message.content}\nParsing command\nBot:\t${message.author.bot}`);
    const args = message.content.split(/[ \t\n]+/); // Might add quoting rules later
    const command = args.shift();
    console.log(`Command:\t${command}\nArgs:\t${args}`);
    try {
        return client.commands.get(command).execute(message);
    } catch(e) {
        return message.reply(`Sorry, there was an error running that command:\n${e.name}: ${e.message}`);
    }
});

client.login(config.token);
