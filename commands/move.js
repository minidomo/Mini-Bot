'use strict';

const CommandsUtil = require('../util/commands');
const servers = require('../config').servers.audio;

class Move {
    static pass(msg, args) {
        let argCount = CommandsUtil.checkArgumentCount(args, 2, 'Not enough arguments.', 'Too many arguments.');
        if (!argCount.result) {
            msg.channel.send(argCount.message);
            return false;
        }
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) {
            msg.channel.send('There are currently no songs in the queue.');
            return false;
        }
        let queue = servers[msg.guild.id].queue;
        if (queue.length < 3) {
            msg.channel.send('It is not possible to move anything with less than 3 audio tracks in the queue.');
            return false;
        }
        if (/^\d+$/g.test(args[0]) && /^\d+$/g.test(args[1])) {
            let a = parseInt(args[0]);
            let b = parseInt(args[1]);
            if (a === b) {
                msg.channel.send(`Silly you! This doesn't change anything!`);
                return false;
            }
            if ((0 < a && a < queue.length) && (0 < b && b < queue.length))
                return true;
        }
        msg.channel.send(`Both positions must be numbers between 1 and ${queue.length - 1}`);
        return false;
    }

    static run(msg, args) {
        let oldPos = parseInt(args[0]);
        let newPos = parseInt(args[1]);
        let vid = servers[msg.guild.id].queue[oldPos];
        servers[msg.guild.id].queue.splice(oldPos, 1);
        servers[msg.guild.id].queue.splice(newPos, 0, vid);
        msg.channel.send(`Moved **${vid.title}** by ${vid.author} to position ${newPos}.`);
    }
}

module.exports = Move;