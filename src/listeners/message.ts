import Client from '../structs/Client';
import Logger from '../util/Logger';
import Handler from '../util/Handler';

Client.on('message', msg => {
    if (!msg.content || msg.channel.type !== 'text') {
        if (msg.embeds.length > 0) {
            Logger.info(`${msg.author.username} sent an embed.`);
        }
        return;
    }
    Logger.info(`<${msg.author.username}> ${msg.content}`);
    const command = Handler.getArgs(msg.content, msg.guild.id);
    if (command) {
        Handler.handle(msg, command);
    }
});