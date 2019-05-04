'use strict';

class MainHandler {
    static log(msg) {
        let out = `${msg.createdAt}\n` +
            `Server: ${msg.guild.name}, ${msg.guild.id}\n` +
            `\tChannel: ${msg.channel.name}, ${msg.channel.id}\n` +
            `User: ${msg.author.tag}, ${msg.author.id}\n`;
        let first = true;
        msg.attachments.map((val, key) => {
            if (first) {
                out += 'Attachments:\n';
                first = false;
            }
            out += '\t' + val.url + '\n';
        });
        if (msg.content.length > 0)
            out += 'Message: ' + msg.content + '\n';
        console.log(out);
    }

    static handleFeature(msg, commands) {
        for (let cmd of commands) {
            let feature = require('../ext/' + cmd);
            if (feature.check(msg)) {
                feature.run(msg);
                return true;
            }
        }
        return false;
    }
}

module.exports = MainHandler;