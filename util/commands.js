'use strict';

const Discord = require('discord.js');

class Commands {
    /**
     * Returns an Object that contains a Boolean value that indiciates if the length of args is equal to the given `limit`, and a String in response to if the length of args is not equal to the given `limit`
     * @param {string[]} args the arguments after the base command
     * @param {number} limit the number of arguments required
     * @param {string} less the message sent if there are less arguments than the limit. Default value is null.
     * @param {string} more the message sent if there are more arguments than the limit. Default value is null.
     * @return {{result: boolean, message?: string}} an Object that contains a Boolean value that indiciates if the length of args is equal to the given `limit`, and a String in response to if the length of args is not equal to the given `limit`
     */
    static checkArgumentCount(args, limit, less = null, more = null) {
        let obj = {};
        if (args.length === limit) {
            obj.result = true;
        } else {
            obj.result = false;
            if (less && args.length < limit)
                obj.message = less;
            else if (more && args.length > limit)
                obj.message = more;
        }
        return obj;
    }
}

module.exports = Commands;