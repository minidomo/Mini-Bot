'use strict';

const CommandsUtil = require('../util/commands');
const RockPaperScissors = require('../games/rockpaperscissors');

class RPS {
    static pass(msg, args) {
        let argCheck = CommandsUtil.checkArgumentCount(args, 2, 'Not enough arguments.', 'Too many arguments.');
        if (!argCheck.result) {
            msg.channel.send(argCheck.message);
            return false;
        }
        if (!RockPaperScissors.canPlay(msg, args))
            return false;
        return true;
    }

    static run(msg, args) {
        RockPaperScissors.play(msg, args);
    }
}

module.exports = RPS;