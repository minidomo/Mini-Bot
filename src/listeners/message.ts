import Client = require('../structs/Client');
import Logger = require('../util/Logger');
import Handler = require('../util/Handler');

Client.on('message', msg => {
    if (!msg.content || msg.channel.type !== 'text') {
        return;
    }
    // Logger.info(`<${msg.author!.username}> ${msg.content}`);
    const command = Handler.getArgs(msg.content, msg.guild!.id);
    if (command) {
        Handler.handle(msg, command);
    }
});