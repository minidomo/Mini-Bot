'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'skip',
    visible: true,
    useable: true,
    desc: 'Skips the current audio.',
    usage: 'skip',
    pass(msg, obj) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers.has(msg.guild.id) || !msg.guild.voiceConnection.dispatcher) {
            msg.channel.send('Nothing is playing');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        const { currentVideo } = servers.get(msg.guild.id);
        msg.channel.send(`Skipping **${currentVideo.title}** by ${currentVideo.author} \`[${currentVideo.duration}]\``);
        msg.guild.voiceConnection.dispatcher.end();
    }
};