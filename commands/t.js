'use strict';

const commandHandler = require('../handler/command');
const config = require('../config');

// getting subcommands
const fs = require('fs');
const commandFiles = fs.readdirSync('./commands/subcommands/t').filter(file => file.endsWith('.js'));
const subcommands = new Map();
for (const file of commandFiles) {
    const command = require(`./subcommands/t/${file}`);
    subcommands.set(command.name, command);
}

module.exports = {
    name: 't',
    visible: true,
    useable: true,
    desc: `Tic Tac Toe base command. \`${config.prefix}t help\` for sub-commands.`,
    usage: 't',
    pass(msg, { args }) {
        if (args.length === 0) {
            msg.channel.send(`Type \`${config.prefix}t help\` to see sub-commands.`);
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