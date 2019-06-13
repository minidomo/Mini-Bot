'use strict';

module.exports = {
    active: true,
    pass(msg) {
        return /^can\s+i\s+get\s+(an|a)\s+[^\s].*\s+in\s+the\s+chat$/gi.test(msg.content);
    },
    run(msg) {
        let res = msg.content;
        res = res.replace(/^can\s+i\s+get\s+(an|a)/gi, '');
        res = res.replace(/in\s+the\s+chat$/gi, '');
        res = res.trim();
        msg.channel.send(res);
    }
};