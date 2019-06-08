'use strict';

const servers = require('../config').servers.audio;

class Shuffle {
    static pass(msg, args) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length < 3) {
            msg.channel.send('There must be at least 3 tracks in the queue to shuffle.');
            return false;
        }
        return true;
    }

    static run(msg, args) {
        let queue = servers[msg.guild.id].queue;
        for (let x = 0; x < queue.length * 5; x++) {
            let pos1 = Math.floor(Math.random() * (queue.length - 1)) + 1
            let pos2 = Math.floor(Math.random() * (queue.length - 1)) + 1
            let t = queue[pos1];
            queue[pos1] = queue[pos2];
            queue[pos2] = t;
        }
        msg.channel.send('Shuffled the queue!');
    }
}

module.exports = Shuffle;