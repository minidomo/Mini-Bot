'use strict';

class Info {
    static pass(msg, args) {
        return true;
    }

    static run(msg, args) {
        msg.channel.send('This bot was made by Mini/JB as a fun project.');
    }
}

module.exports = Info;