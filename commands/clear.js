'use strict';

const servers = require('../config').servers.audio;

class Clear {
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
        msg.channel.send('Clearing the queue.');
        servers[msg.guild.id].queue = [];
    }
}

module.exports = Clear;