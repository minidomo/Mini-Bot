'use strict';

const CommandsUtil = require('../../../util/commands');
const Connect4 = require('../../../games/connect4');
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
            msg.channel.send(`Correct usage is \`${prefix}c4 ${this.usage}\`.`);
            return false;
        }
        return Connect4.canStart(msg, args);
    },
    run(msg, { args }) {
        Connect4.start(msg, args);
    }
};