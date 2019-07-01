'use strict';

const CommandsUtil = require('../util/commands');
const { prefix, servers: allServers } = require('../config');
const servers = allServers.audio;

module.exports = {
    name: 'move',
    visible: true,
    useable: true,
    desc: 'Moves a video to a specified position.',
    usage: 'move <old position> <new position>',
    pass(msg, { args }) {
        const argCount = CommandsUtil.checkArgumentCount(args, 2);
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
        if (queue.length < 2) {
            msg.channel.send('It is not possible to move anything with less than 2 videos in the queue.');
            return false;
        }
        if (/^\d+$/g.test(args[0]) && /^\d+$/g.test(args[1])) {
            const a = parseInt(args[0]) - 1;
            const b = parseInt(args[1]) - 1;
            if (a === b) {
                msg.channel.send(`Silly you! This doesn't change anything!`);
                return false;
            }
            if ((0 <= a && a < queue.length) && (0 <= b && b < queue.length))
                return true;
        }
        msg.channel.send(`Both positions must be numbers between 1 and ${queue.length}`);
        return false;

    },
    run(msg, { args }) {
        const oldPos = parseInt(args[0]) - 1;
        const newPos = parseInt(args[1]) - 1;
        const vid = servers.get(msg.guild.id).queue[oldPos];
        servers.get(msg.guild.id).queue.splice(oldPos, 1);
        servers.get(msg.guild.id).queue.splice(newPos, 0, vid);
        msg.channel.send(`Moved **${vid.title}** by ${vid.author} to position ${newPos + 1}.`);

    }
};