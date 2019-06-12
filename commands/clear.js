'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'clear',
    visible: true,
    useable: true,
    desc: 'Clears the queue.',
    usage: 'clear',
    pass(msg, obj) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers.has(msg.guild.id) || servers.get(msg.guild.id).queue.length === 0) {
            msg.channel.send('The queue is empty.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        msg.channel.send('Clearing the queue.');
        servers.get(msg.guild.id).queue = [];
    }
};