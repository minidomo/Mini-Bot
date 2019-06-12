'use strict';

const CommandsUtil = require('../../../util/commands');
const Connect4 = require('../../../games/connect4');
const { prefix } = require('../../../config');

module.exports = {
    name: 'p',
    visible: true,
    useable: true,
    desc: 'Places your piece on the board.',
    usage: 'p <column>',
    pass(msg, { args }) {
        const argCount = CommandsUtil.checkArgumentCount(args, 1);
        if (!argCount.result) {
            msg.channel.send(`Correct usage is \`${prefix}c4 ${this.usage}\`.`);
            return false;
        }
        return Connect4.canPlace(msg, args);
    },
    run(msg, { args }) {
        Connect4.place(msg, args);
    }
};