const Discord = require('discord.js');
const Config = require('./config');

const client = new Discord.Client();

client.once('ready', () => {
	console.log('Ready!');
});

client.login(Config.token);
