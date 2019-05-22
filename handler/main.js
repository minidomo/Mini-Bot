'use strict';

class MainHandler {
    static log(msg, stream, edited = false) {
        let chat = `[${msg.createdAt.toTimeString().substr(0, 8)}] [${msg.guild.name} | ${msg.channel.name}]:${edited ? ' [EDIT] ' : ' '}<${msg.author.tag}> ${msg.content}`;
        let out = `${msg.createdAt}\n` +
            `Server: ${msg.guild.name}, ${msg.guild.id}\n` +
            `\tChannel: ${msg.channel.name}, ${msg.channel.id}\n` +
            `User: ${msg.author.tag}, ${msg.author.id}\n`;
        if (edited)
            out += '[EDIT]\n';
        let first = true;
        msg.attachments.map((val, key) => {
            if (first) {
                out += 'Attachments:\n';
                chat += ' [';
                first = false;
            }
            out += '\t' + val.url + '\n';
            chat += val.url + ', ';
        });
        if (!first)
            chat = chat.substring(0, chat.length - 2) + ']';
        if (msg.content.length > 0)
            out += 'Message: ' + msg.content + '\n';
        if (!first || msg.content.length > 0) {
            stream.write(chat + '\n');
            console.log(out);
        }
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