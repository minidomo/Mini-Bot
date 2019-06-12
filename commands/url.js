'use strict';

const { prefix, servers: allServers } = require('../config');
const servers = allServers.audio;
const CommandsUtil = require('../util/commands');

module.exports = {
    name: 'url',
    visible: true,
    useable: true,
    desc: 'Gets the URL of the specified audio track in the queue or the current one.',
    usage: 'url <current|position>',
    pass(msg, { args }) {
        const argCount = CommandsUtil.checkArgumentCount(args, 1);
        if (!argCount.result) {
            msg.channel.send(`Correct usage is \`${prefix}${this.usage}\`.`);
            return false;
        }
        if (!servers.has(msg.guild.id) || !servers.get(msg.guild.id).currentVideo) {
            msg.channel.send('Nothing is playing.');
            return false;
        }
        if (args[0] === 'current')
            return true;
        const { queue } = servers.get(msg.guild.id);
        if (queue.length === 0) {
            msg.channel.send('The queue is empty.');
            return false;
        }
        if (/^\d+$/g.test(args[0])) {
            const x = parseInt(args[0]) - 1;
            if (0 <= x && x < queue.length)
                return true;
        }
        msg.channel.send(`Must be a number between 1 and ${queue.length} inclusive or \`current\`.`);
        return false;
    },
    run(msg, { args }) {
        let vid;
        if (args[0] === 'current') {
            vid = servers.get(msg.guild.id).currentVideo;
        } else {
            const x = parseInt(args[0]) - 1;
            vid = servers.get(msg.guild.id).queue[x];
        }
        msg.channel.send(`**${vid.title}** by ${vid.author} <${vid.url}>`);
    }
};