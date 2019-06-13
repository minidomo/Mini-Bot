'use strict';

const Discord = require('discord.js');

class User {
    /**
     * Returns the possible strings if the user is mentioned
     * @param {string} id the user's discord id
     * @return {string[]} the possible strings if the user is mentioned
     */
    static idToMentions(id) {
        return [`<@${id}>`, `<@!${id}>`];
    }

    /**
     * Returns the id of the given `mention`
     * @param {string} mention the discord mention
     * @return {string} the id of the given `mention`
     */
    static mentionToID(mention) {
        return mention.replace(/^<@!?/g, '').replace(/>$/g, '');
    }

    /**
     * Returns true if the given `mention` is a mention of a user, false otherwise
     * @param {string} mention the discord mention
     * @return {boolean} true if the given `mention` is a mention of a user, false otherwise
     */
    static mentionIsAUser(mention) {
        return /^<@!?\d+>$/.test(mention);
    }

    /**
     * Returns true if the given `id` is a bot, false otherwise
     * @param {Discord.Collection<string, Discord.GuildMember>} members the collection of members in a discord server
     * @param {string} id the discord ID of a user
     * @return true if the given `id` is a bot, false otherwise
     * @example
     * // `msg` is type Discord.Message
     * UserUtil.isBot(msg.guild.members, id);
     */
    static isBot(members, id) {
        return members.get(id).user.bot;
    }
}

module.exports = User