'use strict';

const Discord = require('discord.js');
const config = require('../config');

class ReactionHandler {
    /**
     * 
     * @param {Discord.MessageReaction} messageReaction 
     * @returns {{handle: Function|undefined, passed: boolean}}
     */
    static check(messageReaction) {
        const obj = {};
        if (messageReaction.message.embeds.length > 0) {
            obj.handle = handleEmbed;
            obj.passed = true;
        } else if (messageReaction.message.content.length > 0) {
            obj.handle = handleMessage;
            obj.passed = true;
        } else {
            obj.passed = false;
        }
        return obj;
    }
}


/**
 * 
 * @param {Discord.MessageReaction} messageReaction 
 * @param {Discord.User} user 
 * @param {boolean} add
 * @returns {boolean}
 */
const handleEmbed = (messageReaction, user, add) => {
    const embed = messageReaction.message.embeds[0];
    const [type, title] = embed.title.split('|').map(val => val.trim());
    if (config.embedTypes[type] && config.embedTypes[type].has(title))
        return config.embedTypes[type].get(title).handleReaction(messageReaction, user, add);
    return false;
};

/**
 * 
 * @param {Discord.MessageReaction} messageReaction 
 * @param {Discord.User} user 
 * @param {boolean} add
 * @returns {boolean}
 */
const handleMessage = (messageReaction, user, add) => {
    return false;
};

module.exports = ReactionHandler;