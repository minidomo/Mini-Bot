'use strict';

let run;
let config = require('../config');
let commands = config.commands;
let tictactoe = require('../games/tictactoe');

class TicTacToe {
    static pass(msg, args) {
        if (args.length === 0) {
            msg.channel.send('Not enough arguments.');
            return false;
        }
        if (!(args[0] in commands.ttt.subcommands)) {
            msg.channel.send(`Command \`${config.prefix}ttt ${args[0]}\` not found`);
            return false;
        }
        if (args[0] === 'help') {
            if (!isGood(msg, args, 1))
                return false;
            if (!commands.ttt.subcommands.help.useable) {
                msg.channel.send(`Command \`${config.prefix}ttt ${args[0]} is not useable right now.`);
                return false;
            }
            run = help;
            return true;
        } else if (args[0] === 'ff') {
            if (!isGood(msg, args, 1))
                return false;
            if (!commands.ttt.subcommands.ff.useable) {
                msg.channel.send(`Command \`${config.prefix}ttt ${args[0]} is not useable right now.`);
                return false;
            }
            if (!tictactoe.canFF(msg))
                return false;
            run = tictactoe.ff;
            return true;
        } else if (args[0] === 'p') {
            if (!isGood(msg, args, 2))
                return false;
            if (!commands.ttt.subcommands.p.useable) {
                msg.channel.send(`Command \`${config.prefix}ttt ${args[0]} is not useable right now.`);
                return false;
            }
            if (!tictactoe.canPlace(msg, args[1]))
                return false;
            run = tictactoe.place;
            return true;
        } else if (args[0] === 'start') {
            if (!isGood(msg, args, 3))
                return false;
            if (!commands.ttt.subcommands.start.useable) {
                msg.channel.send(`Command \`${config.prefix}ttt ${args[0]} is not useable right now.`);
                return false;
            }
            if (!tictactoe.canStart(msg, args[1], args[2]))
                return false;
            run = tictactoe.start;
            return true;
        }
        return false; // should never reach
    }

    static run(msg, args) {
        run(msg, args);
    }
}

let help = function (msg) {
    let subcommands = commands.ttt.subcommands;
    let func = prop => subcommands[prop].visible ? `\` ${subcommands[prop].usage}\` ${subcommands[prop].desc}\n` : '';
    let fulldesc = '';
    Object.keys(subcommands).forEach(prop => fulldesc += func(prop));
    let embed = new (require('discord.js')).RichEmbed({ description: fulldesc, title: `Sub-commands | Prefix: ${config.prefix}ttt` });
    embed.setColor('RED');
    msg.channel.send(embed);
};

let isGood = (msg, args, lim) => {
    if (args.length === lim)
        return true;
    msg.channel.send(args.length > lim ? 'Too many arguments.' : 'Not enough arguments.');
    return false;
};

module.exports = TicTacToe;