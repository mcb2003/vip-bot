const yargsParser = require('yargs-parser');
const deepmerge = require('deepmerge');

module.exports = class {
    usage = "";

    constructor(config, defaultArgConfig) {
        this.globalConfig = config;
        this.argConfig = deepmerge(defaultArgConfig, (this.argConfig || {}));
    }

    run(message, rawArgs) {
        // Parse the raw command arguments
        const args = yargsParser(rawArgs, this.argConfig);
        // If the user wants help, display it
        if(args.help) {
            return this.sendHelp(message);
        }
        // Future checking (E.G. guild only, user / channel perms, cool-down, etc)
        this.execute(message, args);
    }
    
    sendHelp(message) {
        let reply = `**${this.name}:** ${this.description}`;
            reply += `\n**Usage:** ${this.globalConfig.prefix}${this.name.toLowerCase()} ${this.usage}`;
        if(this.help) {
            reply += '\n' + this.help;
        } else {
            reply += "\nThis command doesn't provide any further help documentation.";
        }
        return message.channel.send(reply);
    }
};
