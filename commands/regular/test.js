'use strict';

const client = require('../../structs/Client');

module.exports = {
    name: 'test',
    desc: 'Test command.',
    usage: 'test',
    validate(msg) {
        if (msg.member.voiceChannelID) {
            return true;
        }
        return false;
    },
    async execute(msg, { args }) {
        let voiceConnection = client.voiceConnections.get(msg.guild.id);
        if (!voiceConnection) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel.joinable) {
                voiceConnection = await voiceChannel.join();
                let dispatcher;
                try {
                    dispatcher = voiceConnection.playFile(args[0]);
                } catch (err) {
                    return;
                }
                dispatcher.on('end', () => {
                    voiceConnection.disconnect();
                });
            }
        }
    }
};