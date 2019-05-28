'use strict';

let run;
const config = require('../config');
const commands = config.commands;
const tictactoe = require('../games/tictactoe');
const CommandsUtil = require('../util/commands');

class TicTacToe {
    static pass(msg, args) {
        if (args.length === 0) {
            msg.channel.send('Not enough arguments.');
            return false;
        }
        if (!(args[0] in commands.t.subcommands)) {
            msg.channel.send(`Command \`${config.prefix}t ${args[0]}\` not found`);
            return false;
        }
        let argCount;
        if (args[0] === 'help') {
            argCount = CommandsUtil.checkArgumentCount(args, 1, 'Not enough arguments.', 'Too many arguments.');
            if (!argCount.result) {
                msg.channel.send(argCount.message);
                return false;
            }
            if (!commands.t.subcommands.help.useable) {
                msg.channel.send(`Command \`${config.prefix}t ${args[0]} is not useable right now.`);
                return false;
            }
            run = help;
            return true;
        } else if (args[0] === 'ff') {
            argCount = CommandsUtil.checkArgumentCount(args, 1, 'Not enough arguments.', 'Too many arguments.');
            if (!argCount.result) {
                msg.channel.send(argCount.message);
                return false;
            }
            if (!commands.t.subcommands.ff.useable) {
                msg.channel.send(`Command \`${config.prefix}t ${args[0]} is not useable right now.`);
                return false;
            }
            if (!tictactoe.canFF(msg))
                return false;
            run = tictactoe.ff;
            return true;
        } else if (args[0] === 'p') {
            argCount = CommandsUtil.checkArgumentCount(args, 2, 'Not enough arguments.', 'Too many arguments.');
            if (!argCount.result) {
                msg.channel.send(argCount.message);
                return false;
            }
            if (!commands.t.subcommands.p.useable) {
                msg.channel.send(`Command \`${config.prefix}t ${args[0]} is not useable right now.`);
                return false;
            }
            if (!tictactoe.canPlace(msg, args[1]))
                return false;
            run = tictactoe.place;
            return true;
        } else if (args[0] === 'start') {
            argCount = CommandsUtil.checkArgumentCount(args, 3, 'Not enough arguments.', 'Too many arguments.');
            if (!argCount.result) {
                msg.channel.send(argCount.message);
                return false;
            }
            if (!commands.t.subcommands.start.useable) {
                msg.channel.send(`Command \`${config.prefix}t ${args[0]} is not useable right now.`);
                return false;
            }
            if (!tictactoe.canStart(msg, args[1], args[2]))
                return false;
            run = tictactoe.start;
            return true;
        }
    }

    static run(msg, args) {
        run(msg, args);
    }
}

let help = function (msg) {
    let subcommands = commands.t.subcommands;
    let func = prop => subcommands[prop].visible ? `\` ${subcommands[prop].usage}\` ${subcommands[prop].desc}\n` : '';
    let fulldesc = '';
    Object.keys(subcommands).forEach(prop => fulldesc += func(prop));
    let embed = new (require('discord.js')).RichEmbed({ description: fulldesc, title: `Sub-commands | Prefix: ${config.prefix}t` });
    embed.setColor('RED');
    msg.channel.send(embed);
};

module.exports = TicTacToe;