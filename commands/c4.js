'use strict';

const commandHandler = require('../handler/command');
const config = require('../config');

// getting subcommands
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/subcommands/c4').filter(file => file.endsWith('.js'));
const subcommands = new Map();
for (const file of commandFiles) {
    const command = require(`./subcommands/c4/${file}`);
    subcommands.set(command.name, command);
}

module.exports = {
    name: 'c4',
    visible: true,
    useable: true,
    desc: `Connect 4 base command. \`${config.prefix}c4 help\` for sub-commands.`,
    usage: 'c4',
    pass(msg, { args }) {
        if (args.length === 0) {
            msg.channel.send(`Type \`${config.prefix}c4 help\` to see sub-commands.`);
            return false;
        }
        const cmd = commandHandler.getArguments(args);
        if (commandHandler.handle(msg, cmd, subcommands))
            return true;
        return false;
    },
    run(msg, obj) {
        // the base command should do nothing itself
    }
};