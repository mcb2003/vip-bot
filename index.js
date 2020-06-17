const fs = require('fs');
const Discord = require('discord.js');
const yargsParser = require('yargs-parser');
const config = require('./config'); // Bot config

const client = new Discord.Client();

// Load commands:
console.info("Loading commands");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    console.info(`Found command file: ${file}`);
    const command = require('./commands/' + file);
    client.commands.set(command.name.toLowerCase(), command);
    console.info(`Loaded command: ${command.name} - ${command.description}`);
}

client.once('ready', () => {
	console.info(`Logged in as ${client.user.username}`);
});

client.on('message', message => {
    // Ignore messages from bots or not directed at us
    if(!message.content.startsWith(config.prefix) || message.author.bot) return;
    const rawArgs = message.content.slice(config.prefix.length)
                .split(/[ \t\n]+/); // Might add quoting rules later
    const commandName = rawArgs.shift().toLowerCase();
    if(client.commands.has(commandName)) {
        const command = client.commands.get(commandName);
        // Parse the command's arguments
        const args = yargsParser(rawArgs);
        try {
            return command.execute(message, args);
        } catch(e) {
            return message.reply(`Sorry, there was an error running that command:\n${e.name}: ${e.message}`);
            console.error(error);
        }
    } else if(config.replyCNF) { // reply on command not found
        return message.reply(`That command doesn't exist. Type "${config.prefix}help" to get a list of commands.`);
    }
});

client.login(config.token);
