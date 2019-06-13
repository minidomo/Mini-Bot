'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'redirect',
    visible: true,
    useable: true,
    desc: 'Directs \'Playing\' messages created from playing videos to the current text channel.',
    usage: 'redirect',
    pass(msg, obj) {
        return true;
    },
    run(msg, obj) {
        if (!servers.has(msg.guild.id))
            servers.set(msg.guild.id, {
                queue: [],
                repeat: { current: false, queue: false },
                channel: null,
                currentVideo: null,
            });
        servers.get(msg.guild.id).channel = msg.channel;
        msg.channel.send('\'Playing\' messages will now be sent here.');
    }
};