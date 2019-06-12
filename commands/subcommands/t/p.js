'use strict';

const CommandsUtil = require('../../../util/commands');
const TicTacToe = require('../../../games/tictactoe');
const { prefix } = require('../../../config');

module.exports = {
    name: 'p',
    visible: true,
    useable: true,
    desc: 'Places your piece on the board.',
    usage: 'p <coordinate>',
    pass(msg, { args }) {
        const argCount = CommandsUtil.checkArgumentCount(args, 1);
        if (!argCount.result) {
            msg.channel.send(`Correct usage is \`${prefix}t ${this.usage}\`.`);
            return false;
        }
        return TicTacToe.canPlace(msg, args);
    },
    run(msg, { args }) {
        TicTacToe.place(msg, args);
    }
};