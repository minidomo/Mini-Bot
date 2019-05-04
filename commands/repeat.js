'use strict';

let config = require('../config');
const commands = config.commands;
const servers = config.servers.audio;

let Repeat = function () {
    this.pass = (msg, args) => {
        if (!isGood(msg, args, 1))
            return false;
        if (!(args[0] in commands.repeat.subcommands)) {
            msg.channel.send('`<state>` must be either `repeat` or `queue`.');
            return false;
        }
        return true;
    };

    this.run = (msg, args) => {
        if (!servers[msg.guild.id])
            servers[msg.guild.id] = { queue: [], repeat: { song: false, queue: false } };
        if (args[0] === 'queue') {
            servers[msg.guild.id].repeat.queue = !servers[msg.guild.id].repeat.queue;
            servers[msg.guild.id].repeat.song = false;
            msg.channel.send(`Repeat queue has been set to **${servers[msg.guild.id].repeat.queue}**.`);
        } else {
            servers[msg.guild.id].repeat.song = !servers[msg.guild.id].repeat.song;
            servers[msg.guild.id].repeat.queue = false;
            msg.channel.send(`Repeat song has been set to **${servers[msg.guild.id].repeat.song}**.`);
        }
    };
};

let isGood = (msg, args, lim) => {
    if (args.length === lim)
        return true;
    msg.channel.send(args.length > lim ? 'Too many arguments.' : 'Not enough arguments.');
    return false;
};

module.exports = new Repeat;