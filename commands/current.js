'use strict';

const servers = require('../config').servers.audio;

module.exports = {
    name: 'current',
    visible: true,
    useable: true,
    desc: 'Shows information about the current video.',
    usage: 'current',
    pass(msg, obj) {
        if (!servers.has(msg.guild.id) || !servers.get(msg.guild.id).currentVideo) {
            msg.channel.send('Nothing is playing.');
            return false;
        }
        return true;
    },
    run(msg, obj) {
        const { title, author, duration, url } = servers.get(msg.guild.id).currentVideo;
        msg.channel.send(`Currently playing **${title}** by ${author} \`[${duration}]\`\n<${url}>`);
    }
};