'use strict';

const client = require('../structs/Client');
const Logger = require('../util/Logger');
const Handler = require('../util/Handler');

client.on('message', msg => {
    if (msg.channel.type !== 'text')
        return;
    if (msg.content) {
        // Logger.info(`<${msg.author.username}> ${msg.content}`);
        const obj = Handler.getArgs(msg.content, msg.guild.id);
        if (obj)
            Handler.handle(msg, obj);
    }
});