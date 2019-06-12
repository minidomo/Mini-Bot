'use strict';

const Connect4 = require('../../../games/connect4');

module.exports = {
    name: 'ff',
    visible: true,
    useable: true,
    desc: 'Surrender your current game.',
    usage: 'ff',
    pass(msg, obj) {
        return Connect4.canFF(msg);
    },
    run(msg, obj) {
        Connect4.ff(msg);
    }
};