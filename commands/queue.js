'use strict';

const servers = require('../config').servers.audio;

class Queue {
    static pass(msg, args) {
        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) {
            msg.channel.send('There are currently no songs in the queue.');
            return false;
        }
        return true;
    }

    static run(msg, args) {
        let res = '```nimrod\n';
        let x = 0;
        for (let track of servers[msg.guild.id].queue) {
            if (x === 0)
                res += 'Current:';
            else
                res += x;
            res += ` ${track.title} by ${track.author} [${track.duration}]\n`;
            x++;
        }
        res += '```';
        msg.channel.send(res);
    }
}

module.exports = Queue;