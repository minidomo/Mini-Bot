'use strict';

class In_The_Chat {
    static run(msg) {
        let res = msg.content;
        res = res.replace(/^can\s+i\s+get\s+(an|a)/gi, '');
        res = res.replace(/in\s+the\s+chat$/gi, '');
        res = res.trim();
        msg.channel.send(res);
    }

    static check(msg) {
        return /^can\s+i\s+get\s+(an|a)\s+[^\s].*\s+in\s+the\s+chat$/gi.test(msg.content);
    }
}

module.exports = In_The_Chat;