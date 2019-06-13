'use strict';

const TicTacToe = require('../../../games/tictactoe');

module.exports = {
    name: 'ff',
    visible: true,
    useable: true,
    desc: 'Surrender your current game.',
    usage: 'ff',
    pass(msg, obj) {
        return TicTacToe.canFF(msg);
    },
    run(msg, obj) {
        TicTacToe.ff(msg);
    }
};