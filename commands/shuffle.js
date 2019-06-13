'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'shuffle',
    visible: true,
    useable: true,
    desc: 'Shuffles the queue.',
    usage: 'shuffle',
    pass(msg, obj) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers.has(msg.guild.id) || servers.get(msg.guild.id).queue.length < 2) {
            msg.channel.send('There must be at least 2 videos in the queue to shuffle.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        const { queue } = servers.get(msg.guild.id);
        for (let x = 0; x < queue.length * 5; x++) {
            const pos1 = Math.floor(Math.random() * queue.length);
            const pos2 = Math.floor(Math.random() * queue.length);
            const t = queue[pos1];
            queue[pos1] = queue[pos2];
            queue[pos2] = t;
        }
        msg.channel.send('Shuffled the queue!');
    }
};