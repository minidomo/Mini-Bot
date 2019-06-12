'use strict';

module.exports = {
    name: 'resume',
    visible: true,
    useable: true,
    desc: 'Resumes the current audio.',
    usage: 'resume',
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
        if (!msg.guild.voiceConnection.dispatcher.paused) {
            msg.channel.send('The current video is not paused.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        msg.guild.voiceConnection.dispatcher.resume();
        msg.channel.send('Resuming.');
    }
};