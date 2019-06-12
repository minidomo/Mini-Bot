'use strict';

const { prefix, servers: allServers } = require('../config');
const servers = allServers.audio;
const CommandsUtil = require('../util/commands');

module.exports = {
    name: 'repeat',
    visible: true,
    useable: true,
    desc: 'Turn repeat on/off for either the current video or the whole queue.',
    usage: 'repeat <current|queue>',
    pass(msg, { args }) {
        const argCount = CommandsUtil.checkArgumentCount(args, 1);
        if (!argCount.result) {
            msg.channel.send(`Correct usage is \`${prefix}${this.usage}\`.`);
            return false;
        }
        if (args[0] === 'current' || args[0] === 'queue')
            return true;
        msg.channel.send('`<state>` must be either `current` or `queue`.');
        return false;
    },
    run(msg, { args }) {
        if (!servers.has(msg.guild.id))
            servers.set(msg.guild.id, {
                queue: [],
                repeat: { current: false, queue: false },
                channel: null,
                currentVideo: null,
            });
        if (args[0] === 'queue') {
            servers.get(msg.guild.id).repeat.queue = !servers.get(msg.guild.id).repeat.queue;
            servers.get(msg.guild.id).repeat.currentsong = false;
            msg.channel.send(`Repeat queue has been set to **${servers.get(msg.guild.id).repeat.queue}**.`);
        } else {
            servers.get(msg.guild.id).repeat.current = !servers.get(msg.guild.id).repeat.current;
            servers.get(msg.guild.id).repeat.queue = false;
            msg.channel.send(`Repeat current has been set to **${servers.get(msg.guild.id).repeat.current}**.`);
        }
    }
};