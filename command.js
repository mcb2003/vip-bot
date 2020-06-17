const yargsParser = require('yargs-parser');
const deepmerge = require('deepmerge');

module.exports = class {
    constructor(config, defaultArgConfig) {
        this.argConfig = deepmerge(defaultArgConfig, (this.argConfig || {}));
    }

    run(message, rawArgs) {
        // Parse the raw command arguments
        const args = yargsParser(rawArgs, this.argConfig);
        // Future checking (E.G. guild only, user / channel perms, cool-down, etc)
        this.execute(message, args);
    }
};
