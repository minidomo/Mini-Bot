'use strict';

const config = require('../config');
const commands = config.commands;
const servers = config.servers.audio;
const CommandsUtil = require('../util/commands');

class Repeat {
    static pass(msg, args) {
        let argCount = CommandsUtil.checkArgumentCount(args, 1, 'Not enough arguments.', 'Too many arguments.');
        if (!argCount.result) {
            msg.channel.send(argCount.message);
            return false;
        }
        if (!(args[0] in commands.repeat.subcommands)) {
            msg.channel.send('`<state>` must be either `current` or `queue`.');
            return false;
        }
        return true;
    }

    static run(msg, args) {
        if (!servers[msg.guild.id])
            servers[msg.guild.id] = { queue: [], repeat: { current: false, queue: false } };
        if (args[0] === 'queue') {
            servers[msg.guild.id].repeat.queue = !servers[msg.guild.id].repeat.queue;
            servers[msg.guild.id].repeat.currentsong = false;
            msg.channel.send(`Repeat queue has been set to **${servers[msg.guild.id].repeat.queue}**.`);
        } else {
            servers[msg.guild.id].repeat.current = !servers[msg.guild.id].repeat.current;
            servers[msg.guild.id].repeat.queue = false;
            msg.channel.send(`Repeat song has been set to **${servers[msg.guild.id].repeat.current}**.`);
        }
    }
}

module.exports = Repeat;