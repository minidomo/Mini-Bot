'use strict';

const Discord = require('discord.js');
const { regular, admin } = require('../commands/commands');
const { Settings } = require('../settings/settings');
const Message = require('./Message');

/**
 * @typedef {object} Command
 * @property {Function<boolean>} validate
 * @property {Function<void>} execute
 */

/**
 * @typedef {object} Args
 * @property {string} base
 * @property {string[]} args
 */

module.exports = {
    /**
     * 
     * @param {string|string[]} content 
     * @param {string} guild_id
     * @returns {Args}
     */
    getArgs(content, guild_id) {
        if (typeof content === 'string') {
            const prefix = Settings.get(guild_id).prefix;
            if (content.startsWith(prefix)) {
                const match = /^([^\w\d\s]+)/.exec(content);
                if (match && match[1] === prefix) {
                    const pre = content.substr(prefix.length).split(/\s+/g);
                    const fixed = pre.join(' ');
                    const arr = fixed.match(/("[^"]*"|[^\s]+)/g).map(str => {
                        let res = str;
                        if (str.startsWith('"') && str.endsWith('"'))
                            res = str.substring(1, str.length - 1).trim();
                        return res;
                    }).filter(str => str.length > 0);
                    return {
                        base: arr.shift().toLowerCase(),
                        args: arr
                    };
                }
            }
        } else if (Array.isArray(content)) {
            const arr = content.slice();
            return {
                base: arr.shift().toLowerCase(),
                args: arr
            };
        }
        return undefined;
    },
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {Args} obj 
     */
    handle(msg, obj) {
        const reg = regular.has(obj.base),
            ad = admin.has(obj.base),
            perm = msg.member.permissions.has(Discord.Permissions.FLAGS.ADMINISTRATOR);
        if (ad && perm) {
            const command = admin.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        } else if (reg) {
            const command = regular.get(obj.base);
            if (command.validate(msg, obj)) {
                command.execute(msg, obj);
                return true;
            }
        }
        return false;
    }
};