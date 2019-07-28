'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const Youtube = require('../../util/Youtube');
const Hex = require('../../util/Hex');
const client = require('../../structs/Client');
const Discord = require('discord.js');

module.exports = {
    name: 'playpl',
    desc: 'Play playlists.',
    usage: 'playpl <?playlist names>',
    validate(msg) {
        if (msg.member.voiceChannelID) {
            return true;
        }
        Message.userMustBeInVoiceChannel(msg);
        return false;
    },
    async execute(msg, { args }) {
        const voiceConnection = client.voiceConnections.get(msg.guild.id);
        if (!voiceConnection) {
            const voiceChannel = msg.member.voiceChannel;
            if (voiceChannel.joinable)
                await voiceChannel.join();
        }
        const queue = Settings.get(msg.guild.id).queue;
        if (args.length === 0) {
            if (queue.size() > 0)
                Youtube.play(Settings, msg.guild.id, msg.channel.id);
        } else {
            let added = 0;
            const playlists = Settings.get(msg.guild.id).playlists;
            for (const name of args) {
                if (!playlists.has(name))
                    continue;
                const playlist = playlists.get(name);
                playlist.list.forEach(song => {
                    if (!queue.has(song)) {
                        queue.add(song);
                        added++;
                    }
                });
            }
            if (queue.size() > 0)
                Youtube.play(Settings, msg.guild.id, msg.channel.id);
            const description = `Added ${added} song(s)`;
            const embed = new Discord.RichEmbed()
                .setColor(Hex.generate(true))
                .setDescription(description);
            Message.custom(msg, embed);
        }
    }
};