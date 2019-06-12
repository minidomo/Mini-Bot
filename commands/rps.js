'use strict';

const CommandsUtil = require('../util/commands');
const RockPaperScissors = require('../games/rockpaperscissors');
const { prefix } = require('../config');

module.exports = {
    name: 'rps',
    visible: true,
    useable: true,
    desc: 'An RNG Rock Paper Scissors game.',
    usage: 'rps <user1> <user2>',
    pass(msg, { args }) {
        const argCheck = CommandsUtil.checkArgumentCount(args, 2);
        if (!argCheck.result) {
            msg.channel.send(`Correct usage is \`${prefix}${this.usage}\`.`);
            return false;
        }
        if (!RockPaperScissors.canPlay(msg, args))
            return false;
        return true;
    },
    run(msg, { args }) {
        RockPaperScissors.play(msg, args);
    }
};