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
            return message.channel.send(this.helpString);
        }
        // Check for and inforce positional argument requirements
        if(this.nPosArgs && this.nPosArgs !== args._.length) {
            return message.reply(`You must provide exactly ${this.nPosArgs} positional arguments (${args._.length} given).
                \n${this.usageString}`);
        }
        // Future checking (E.G. guild only, user / channel perms, cool-down, etc)
        this.execute(message, args);
    }
    
    get usageString() {
// If no usage, the space is trimmed
            return `**Usage:** ${this.globalConfig.prefix}${this.name.toLowerCase()} ${this.usage}`.trim();
    }
    
    get helpString() {
        let helpText = `**${this.name}:** ${this.description}
        \n${this.usageString}`;
        if(this.help) {
            helpText += '\n' + this.help;
        } else {
            helpText += "\nThis command doesn't provide any further help documentation.";
        }
        return helpText;
    }
};
