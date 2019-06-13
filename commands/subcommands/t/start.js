'use strict';

const CommandsUtil = require('../../../util/commands');
const TicTacToe = require('../../../games/tictactoe');
const { prefix } = require('../../../config');

module.exports = {
    name: 'start',
    visible: true,
    useable: true,
    desc: 'Start a game with another player.',
    usage: 'start <user1> <user2>',
    pass(msg, { args }) {
        const argCount = CommandsUtil.checkArgumentCount(args, 2);
        if (!argCount.result) {
            msg.channel.send(`Correct usage is \`${prefix}t ${this.usage}\`.`);
            return false;
        }
        return TicTacToe.canStart(msg, args);
    },
    run(msg, { args }) {
        TicTacToe.start(msg, args);
    }
};