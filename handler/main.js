'use strict';

const LOG_TYPE = { NEW: 0, EDITED: 1, DELETED: 2 };

class MainHandler {
    static log(msg, stream, type) {
        let chat = `[${msg.createdAt.toTimeString().substr(0, 8)}] [${msg.guild.name} | ${msg.channel.name}]: <${msg.author.tag}>`;
        let out = `${msg.createdAt}\n` +
            `Server: ${msg.guild.name}, ${msg.guild.id}\n` +
            `\tChannel: ${msg.channel.name}, ${msg.channel.id}\n` +
            `User: ${msg.author.tag}, ${msg.author.id}\n`;
        if (type === LOG_TYPE.EDITED) {
            out += '[EDIT]\n';
            chat += ' [EDIT]';
        } else if (type === LOG_TYPE.DELETED) {
            out += '[DELETE]\n';
            chat += ' [DELETE]';
        }
        if (msg.content.length > 0) {
            out += 'Message: ' + msg.content + '\n';
            chat += ` ${msg.content}`;
        }
        let firstAttachment = true;
        msg.attachments.map((val, key) => {
            if (firstAttachment) {
                out += 'Attachments:\n';
                chat += ' ATTACHMENTS:[';
                firstAttachment = false;
            }
            out += '\t' + val.url + '\n';
            chat += val.url + ', ';
        });
        if (!firstAttachment)
            chat = chat.substring(0, chat.length - 2) + ']';
        if (msg.embeds.length > 0) {
            out += 'Embeds:\n';
            chat += ' EMBEDS:[';
            for (let embed of msg.embeds) {
                chat += embed.title + ', ';
                out += '\t' + embed.title + '\n';
            }
            chat = chat.substring(0, chat.length - 2) + ']';
        }
        stream.write(chat + '\n');
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

module.exports = { handler: MainHandler, type: LOG_TYPE };