'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'queue',
    visible: true,
    useable: true,
    desc: 'Shows the current videos in the queue.',
    usage: 'queue',
    pass(msg, obj) {
        if (!servers.has(msg.guild.id) || servers.get(msg.guild.id).queue.length === 0) {
            msg.channel.send('The queue is empty.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        const { queue } = servers.get(msg.guild.id);
        let res = '```nimrod\n';
        let x = 1;
        for (const { title, author, duration } of queue)
            res += `${x++} ${title} by ${author} [${duration}]\n`;
        res += '```';
        msg.channel.send(res);
    }
};