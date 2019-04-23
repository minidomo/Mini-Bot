'use strict';

class CommandHandler {
    static getArguments(msg, prefix) {
        let arr = msg.content.substring(prefix.length).split(/\s+/g);
        let obj = {};
        obj.base = arr.shift();
        obj.args = arr;
        return obj;
    }

    static handle(msg, obj, config) {
        if (typeof config.commands[obj.base] === 'undefined') {
            msg.channel.send(`Command ${config.prefix}${obj.base} not found.`);
            return false;
        }
        if (!config.commands[obj.base].useable) {
            msg.channel.send(`Command ${config.prefix}${obj.base} is not useable right now.`);
            return false;
        }
        let cmd = require('../commands/' + obj.base);
        if (!cmd.pass(msg, obj.args))
            return false;
        cmd.run(msg, obj.args);
        return true;
    }
}

module.exports = CommandHandler;