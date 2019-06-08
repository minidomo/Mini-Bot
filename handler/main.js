'use strict';

const LOG_TYPE = { NEW: 0, EDITED: 1, DELETED: 2 };

class MainHandler {
    static log(msg, type) {
        let chat = `[${msg.createdAt.toTimeString().substr(0, 8)}] [${msg.guild.name} | ${msg.channel.name}]: <${msg.author.tag}>`;
        if (type === LOG_TYPE.EDITED) {
            chat += ' [EDIT]';
        } else if (type === LOG_TYPE.DELETED) {
            chat += ' [DELETE]';
        }
        if (msg.content.length > 0) {
            chat += ` ${msg.content}`;
        }
        let firstAttachment = true;
        msg.attachments.map((val, key) => {
            if (firstAttachment) {
                chat += ' ATTACHMENTS:[';
                firstAttachment = false;
            }
            chat += val.url + ', ';
        });
        if (!firstAttachment)
            chat = chat.substring(0, chat.length - 2) + ']';
        if (msg.embeds.length > 0) {
            chat += ' EMBEDS:[';
            for (let embed of msg.embeds) {
                chat += embed.title + ', ';
            }
            chat = chat.substring(0, chat.length - 2) + ']';
        }
        console.log(chat);
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