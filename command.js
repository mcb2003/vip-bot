/*
    VIP Bot - Yet another Discord bot!

    Copyright (c) 2020 Michael Connor Buchan

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/

const yargsParser = require('yargs-parser');
const deepmerge = require('deepmerge');

module.exports = {
    Command: class {
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
    }
};
