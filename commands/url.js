'use strict';

const servers = require('../config').servers.audio;
const CommandsUtil = require('../util/commands');

class URL {
    static pass(msg, args) {
        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) {
            msg.channel.send('There are currently no songs in the queue.');
            return false;
        }
        let argCount = CommandsUtil.checkArgumentCount(args, 1, 'Not enough arguments.', 'Too many arguments.');
        if (!argCount.result) {
            msg.channel.send(argCount.message);
            return false;
        }
        let queue = servers[msg.guild.id].queue;
        if (/^\d+$/g.test(args[0])) {
            let x = parseInt(args[0]);
            if (0 <= x && x < queue.length)
                return true;
        }
        msg.channel.send(`Must be a number between 0 and ${queue.length - 1} inclusive.`);
        return false;
    }

    static run(msg, args) {
        let x = parseInt(args[0]);
        let vid = servers[msg.guild.id].queue[x];
        msg.channel.send(`**${vid.title}** by ${vid.author} <${vid.url}>`);
    }
}

module.exports = URL;