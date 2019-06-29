'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'stop',
    visible: true,
    useable: true,
    desc: 'Stops the audio, and the bot leaves.',
    usage: 'stop',
    pass(msg, obj) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!msg.guild.voiceConnection) {
            msg.channel.send('The bot is not in a voice channel.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        msg.channel.send('Removing all tracks (if any) from queue.');
        const server = servers.get(msg.guild.id);
        server.repeat = { current: false, queue: false };
        server.queue = [];
        if (msg.guild.voiceConnection.dispatcher)
            msg.guild.voiceConnection.dispatcher.end();
        if (msg.guild.voiceConnection)
            msg.guild.voiceConnection.disconnect();
    }
};