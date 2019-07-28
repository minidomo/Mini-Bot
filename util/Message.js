'use strict';

const Discord = require('discord.js');
const { Settings } = require('../settings/settings');

module.exports = {
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {string} name 
     */
    async playlistNotFound(msg, name) {
        return await msg.channel.send(`playlist \`${name}\` was not found`);
    },
    /**
     * 
     * @param {Discord.Messageg} msg 
     * @param {string} name 
     */
    async playlistAlreadyExists(msg, name) {
        return await msg.channel.send(`playlist \`${name}\` already exists`);
    },
    /**
     * 
     * @param {Discord.Message} msg
     * @param {string} usage 
     */
    async correctUsage(msg, usage) {
        return await msg.channel.send(`Correct usage is \`${Settings.get(msg.guild.id).prefix}${usage}\``);
    },
    /**
     * 
     * @param {Discord.Message} msg 
     */
    async userMustBeInVoiceChannel(msg) {
        return await msg.channel.send('You must be in a voice channel to use this command');
    },
    /**
     * 
     * @param {Discord.Message} msg 
     */
    async botMustBeInVoiceChannel(msg) {
        return await msg.channel.send('The bot must be in a voice channel to use this command.');
    },
    /**
     * 
     * @param {Discord.Message} msg 
     */
    async botMustBePlayingAudio(msg) {
        return await msg.channel.send('The bot must be playing music to use this command.');
    },
    /**
     * 
     * @param {Discord.Message} msg 
     */
    async queueIsEmpty(msg) {
        return await msg.channel.send('The queue is empty.');
    },
    /**
     * 
     * @param {Discord.Message} msg 
     * @param {string|Discord.RichEmbed|Discord.MessageAttachment} message 
     */
    async custom(msg, message) {
        return await msg.channel.send(message);
    }
};