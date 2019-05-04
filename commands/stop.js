'use strict';

const servers = require('../config').servers.audio;

let Stop = function () {
    this.pass = (msg, args) => {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers[msg.guild.id]) {
            msg.channel.send('The bot is not in a voice channel.');
            return false;
        }
        return true;
    };

    this.run = (msg, args) => {
        msg.channel.send('Removing all songs from queue.');
        servers[msg.guild.id].repeat = { song: false, queue: false };
        servers[msg.guild.id].queue = [];
        servers[msg.guild.id].dispatcher.end();
        msg.guild.voiceConnection.disconnect();
    };
};

module.exports = new Stop;