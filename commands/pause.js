'use strict';

module.exports = {
    name: 'pause',
    visible: true,
    useable: true,
    desc: 'Pauses the current video.',
    usage: 'pause',
    pass(msg, obj) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!msg.guild.voiceConnection) {
            msg.channel.send('The bot is not connected to a voice channel.');
            return false;
        }
        if (!msg.guild.voiceConnection.dispatcher) {
            msg.channel.send('Nothing is playing.');
            return false;
        }
        if (msg.guild.voiceConnection.dispatcher.paused) {
            msg.channel.send('The current video is already paused.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        msg.guild.voiceConnection.dispatcher.pause();
        msg.channel.send('Pausing.');
    }
};