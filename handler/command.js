'use strict';

class CommandHandler {
    static getArguments(msg, prefix) {
        let arr = msg.content.substring(prefix.length).split(/\s+/g);
        let obj = {};
        obj.base = arr.shift();
        obj.args = arr;
        return obj;
    }

    static handle(msg, obj, commands) {
        if (typeof commands[obj.base] === 'undefined')
            return false;
        if (!commands[obj.base].useable)
            return false;
        let cmd = require('../commands/' + obj.base);
        if (!cmd.pass(msg, obj.args))
            return false;
        cmd.run(msg, obj.args);
        return true;
    }
}

module.exports = CommandHandler;