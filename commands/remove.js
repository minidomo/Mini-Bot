'use strict';

const servers = require('../config').servers.audio;

class Remove {
    static pass(msg, args) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) {
            msg.channel.send('There are currently no songs in the queue.');
            return false;
        }
        if (!isGood(msg, args, 1))
            return false;
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
        servers[msg.guild.id].queue.splice(x, 1);
        msg.channel.send(`Removed **${vid.title}** by ${vid.author} from queue.`);
    }
}

let isGood = (msg, args, lim) => {
    if (args.length === lim)
        return true;
    msg.channel.send(args.length > lim ? 'Too many arguments.' : 'Not enough arguments.');
    return false;
};

module.exports = Remove;