'use strict';

const servers = require('../config').servers.audio;
const CommandsUtil = require('../util/commands');

class Redirect {
    static pass(msg, args) {
        let argCount = CommandsUtil.checkArgumentCount(args, 0, '', 'Too many arguments.');
        if (!argCount.result) {
            msg.channel.send(argCount.message);
            return false;
        }
        return true;
    }

    static run(msg, args) {
        if (!servers[msg.guild.id])
            servers[msg.guild.id] = { queue: [], repeat: { current: false, queue: false } };
        servers[msg.guild.id].channel = msg.channel;
        msg.channel.send('\'Playing\' messages will now be sent here.');
    }
}

module.exports = Redirect;