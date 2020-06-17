const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config'); // Bot config

const client = new Discord.Client();

// Default command argument config.
const defaultArgConfig = {
    configuration: {
        'strip-aliased': true,
        'strip-dashed': true,
    },
    alias: {
        help: ['h']
    },
    boolean: ['help']
};

// Load commands:
console.info("Loading commands");
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
for(const file of commandFiles) {
    console.info(`Found command file: ${file}`);
    const CommandClass = require('./commands/' + file);
    const command = new CommandClass(config, defaultArgConfig);
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
        try {
            return command.run(message, rawArgs);
        } catch(e) {
            return message.reply(`Sorry, there was an error running that command:\n${e.name}: ${e.message}`);
            console.error(error);
        }
    } else if(config.replyCNF) { // reply on command not found
        return message.reply(`That command doesn't exist. Type "${config.prefix}help" to get a list of commands.`);
    }
});

client.login(config.token);
