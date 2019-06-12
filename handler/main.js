'use strict';

const Discord = require('discord.js');

// load active extensions
const fs = require('fs');
const extentionFiles = fs.readdirSync('./ext').filter(file => file.endsWith('.js'));
const active = [];
for (const file of extentionFiles) {
    const ext = require(`../ext/${file}`);
    if (ext.active)
        active.push(ext);
}

const LOG_TYPE = { NEW: 0, EDITED: 1, DELETED: 2 };

class MainHandler {

    /**
     * Logs information about the message sent by a user
     * @param {Discord.Message} msg the message object sent by a user
     * @param {number} type the type of message being sent 
     */
    static log(msg, type) {
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

    /**
     * Returns true if a feature was ran, false otherwise
     * @param {Discord.Message} msg the message object sent by the user
     * @returns true if a feature was ran, false otherwise
     */
    static handleFeature(msg) {
        let ran = false;
        for (const ext of active) {
            if (ext.pass(msg)) {
                ran = true;
                ext.run(msg);
            }
        }
        return ran;
    }
}

module.exports = { handler: MainHandler, logtype: LOG_TYPE };