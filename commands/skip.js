'use strict';

const servers = require('../config').servers.audio;

class Skip {
    static pass(msg, args) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers[msg.guild.id] || servers[msg.guild.id].queue.length === 0) {
            msg.channel.send('There are currently no songs in the queue.');
            return false;
        }
        return true;
    }

    static run(msg, args) {
        let queue = servers[msg.guild.id].queue;
        msg.channel.send(`Skipping **${queue[0].title}** by ${queue[0].author} \`[${queue[0].duration}]\``);
        servers[msg.guild.id].dispatcher.end();
    }
}

module.exports = Skip;