'use strict';

class Info {
    static pass(msg, args) {
        return true;
    }

    static run(msg, args) {
        msg.channel.send('This bot was made by Mini/JB as a fun project. Source code on Github. https://github.com/MiniDomo/Mini-Bot');
    }
}

module.exports = Info;