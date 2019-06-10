'use strict';

const LOG_TYPE = { NEW: 0, EDITED: 1, DELETED: 2 };

class MainHandler {
    static log(msg, stream, type) {
        let res = `[${msg.createdAt.toTimeString().substr(0, 8)}] [${msg.guild.name} | ${msg.channel.name}]: <${msg.author.tag}>`;
        if (type === LOG_TYPE.EDITED)
            res += ' [EDIT]';
        else if (type === LOG_TYPE.DELETED)
            res += ' [DELETE]';
        if (msg.content.length > 0)
            res += ` ${msg.content}`;
        let firstAttachment = true;
        msg.attachments.map((val, key) => {
            if (firstAttachment) {
                res += ' ATTACHMENTS:[';
                firstAttachment = false;
            }
            res += val.url + ', ';
        });
        if (!firstAttachment)
            res = res.substring(0, res.length - 2) + ']';
        if (msg.embeds.length > 0) {
            res += ' EMBEDS:[';
            for (let embed of msg.embeds)
                res += embed.title + ', ';
            res = res.substring(0, res.length - 2) + ']';
        }
        msg.logger.info(res);
    }

    static handleFeature(msg, features) {
        for (let feature of features) {
            let ft = require('../ext/' + feature);
            if (ft.pass(msg)) {
                ft.run(msg);
                return true;
            }
        }
        return false;
    }
}

module.exports = { handler: MainHandler, logtype: LOG_TYPE };