'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');

module.exports = {
    name: 'setprefix',
    desc: 'Sets the prefix of the bot.',
    usage: 'setprefix <prefix>',
    validate(msg, { args }) {
        if (args.length !== 1) {
            Message.correctUsage(msg, this.usage);
            return false;
        }
        if (/^[^\w\d\s]+$/.test(args[0])) {
            return true;
        }
        Message.custom(msg, `Invalid prefix. Prefix cannot include letters, numbers, whitespace, or underscores.`);
        return false;
    },
    execute(msg, { args }) {
        Settings.get(msg.guild.id).prefix = args[0];
        Message.custom(msg, `Prefix has been changed to: \`${args[0]}\``);
    }
}; 