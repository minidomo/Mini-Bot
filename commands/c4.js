'use strict';

let run;
let config = require('../config');
let commands = config.commands;
let connect4 = require('../games/connect4');

class C4 {
    static pass(msg, args) {
        if (args.length === 0) {
            msg.channel.send('Not enough arguments.');
            return false;
        }
        if (!(args[0] in commands.c4.subcommands)) {
            msg.channel.send(`Command \`${config.prefix}c4 ${args[0]}\` not found`);
            return false;
        }
        if (args[0] === 'help') {
            if (!isGood(msg, args, 1))
                return false;
            if (!commands.c4.subcommands.help.useable) {
                msg.channel.send(`Command \`${config.prefix}c4 ${args[0]} is not useable right now.`);
                return false;
            }
            run = help;
            return true;
        } else if (args[0] === 'ff') {
            if (!isGood(msg, args, 1))
                return false;
            if (!commands.c4.subcommands.ff.useable) {
                msg.channel.send(`Command \`${config.prefix}c4 ${args[0]} is not useable right now.`);
                return false;
            }
            if (!connect4.canFF(msg))
                return false;
            run = connect4.ff;
            return true;
        } else if (args[0] === 'p') {
            if (!isGood(msg, args, 2))
                return false;
            if (!commands.c4.subcommands.p.useable) {
                msg.channel.send(`Command \`${config.prefix}c4 ${args[0]} is not useable right now.`);
                return false;
            }
            if (!connect4.canPlace(msg, args[1]))
                return false;
            run = connect4.place;
            return true;
        } else if (args[0] === 'start') {
            if (!isGood(msg, args, 3))
                return false;
            if (!commands.c4.subcommands.start.useable) {
                msg.channel.send(`Command \`${config.prefix}c4 ${args[0]} is not useable right now.`);
                return false;
            }
            if (!connect4.canStart(msg, args[1], args[2]))
                return false;
            run = connect4.start;
            return true;
        }
        return false; // should never reach
    }

    static run(msg, args) {
        run(msg, args);
    }
}

let help = function (msg) {
    let subcommands = commands.c4.subcommands;
    let func = prop => subcommands[prop].visible ? `\` ${subcommands[prop].usage}\` ${subcommands[prop].desc}\n` : '';
    let fulldesc = '';
    Object.keys(subcommands).forEach(prop => fulldesc += func(prop));
    let embed = new (require('discord.js')).RichEmbed({ description: fulldesc, title: `Sub-commands | Prefix: ${config.prefix}c4` });
    embed.setColor('RED');
    msg.channel.send(embed);
};

let isGood = (msg, args, lim) => {
    if (args.length === lim)
        return true;
    msg.channel.send(args.length > lim ? 'Too many arguments.' : 'Not enough arguments.');
    return false;
};

module.exports = C4;