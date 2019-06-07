'use strict';

class Pause {
    static pass(msg, args) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!msg.guild.voiceConnection) {
            msg.channel.send('The bot is not connected to a voice channel.');
            return false;
        }
        if (!msg.guild.voiceConnection.dispatcher) {
            msg.channel.send('Nothing is currently playing.');
            return false;
        }
        if (msg.guild.voiceConnection.dispatcher.paused) {
            msg.channel.send('The current audio is already paused.');
            return false;
        }
        return true;
    }

    static run(msg, args) {
        msg.guild.voiceConnection.dispatcher.pause();
        msg.channel.send('Pausing.');
    }
}

module.exports = Pause;