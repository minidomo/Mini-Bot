import Discord = require('discord.js');
import Settings = require('../structs/Settings');

export = {
    async playlistNotFound(msg: Discord.Message, name: string) {
        return await msg.channel.send(`playlist \`${name}\` was not found`);
    },
    async playlistAlreadyExists(msg: Discord.Message, name: string) {
        return await msg.channel.send(`playlist \`${name}\` already exists`);
    },
    async correctUsage(msg: Discord.Message, usage: string) {
        return await msg.channel.send(`Correct usage is \`${Settings.object.get(msg.guild!.id).prefix}${usage}\``);
    },
    async userMustBeInVoiceChannel(msg: Discord.Message) {
        return await msg.channel.send('You must be in a voice channel to use this command');
    },
    async botMustBeInVoiceChannel(msg: Discord.Message) {
        return await msg.channel.send('The bot must be in a voice channel to use this command.');
    },
    async botMustBePlayingAudio(msg: Discord.Message) {
        return await msg.channel.send('The bot must be playing music to use this command.');
    },
    async queueIsEmpty(msg: Discord.Message) {
        return await msg.channel.send('The queue is empty.');
    },
    async mustBeAdmin(msg: Discord.Message) {
        return await msg.channel.send('You must be admin to use this command.');
    },
    async queueMustBeSize(msg: Discord.Message, size: number) {
        return await msg.channel.send(`The queue must have at least ${size} song(s).`);
    },
    async mustBeANumberWithin(msg: Discord.Message, lb: number, ub: number) {
        return await msg.channel.send(`The number must be between ${lb} and ${ub}`);
    },
    async botMustBePaused(msg: Discord.Message) {
        return await msg.channel.send('The bot is not paused.');
    },
    async custom(msg: Discord.Message, string: string) {
        return await msg.channel.send(string);
    }
};