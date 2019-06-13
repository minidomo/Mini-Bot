'use strict';

const { prefix, servers: allServers } = require('../config');
const servers = allServers.audio;
const CommandsUtil = require('../util/commands');

module.exports = {
    name: 'remove',
    visible: true,
    useable: true,
    desc: 'Remove a video from the queue.',
    usage: 'remove <position>',
    pass(msg, { args }) {
        let argCount = CommandsUtil.checkArgumentCount(args, 1);
        if (!argCount.result) {
            msg.channel.send(`Correct usage is \`${prefix}${this.usage}\`.`);
            return false;
        }
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!servers.has(msg.guild.id) || servers.get(msg.guild.id).queue.length === 0) {
            msg.channel.send('The queue is empty.');
            return false;
        }
        const { queue } = servers.get(msg.guild.id);
        if (/^\d+$/g.test(args[0])) {
            let x = parseInt(args[0]) - 1;
            if (0 <= x && x < queue.length)
                return true;
        }
        msg.channel.send(`Must be a number between 1 and ${queue.length} inclusive.`);
        return false;

    },
    run(msg, { args }) {
        const x = parseInt(args[0]) - 1;
        const vid = servers.get(msg.guild.id).queue[x];
        servers.get(msg.guild.id).queue.splice(x, 1);
        msg.channel.send(`Removed **${vid.title}** by ${vid.author} from queue.`);
    }
};