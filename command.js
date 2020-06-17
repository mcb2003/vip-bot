const yargsParser = require('yargs-parser');

module.exports = class {
    run(message, rawArgs) {
        // Parse the raw command arguments
        const args = yargsParser(rawArgs);
        // Future checking (E.G. guild only, user / channel perms, cool-down, etc)
        this.execute(message, args);
    }
};
