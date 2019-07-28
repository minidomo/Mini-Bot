'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const Youtube = require('../../util/Youtube');
const Hex = require('../../util/Hex');
const client = require('../../structs/Client');
const Discord = require('discord.js');

module.exports = {
    name: 'play',
    desc: 'Plays songs.',
    usage: 'play <?url|title|id>',
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
            for (const elem of args) {
                const validId = Youtube.ytdl.validateID(elem);
                if (validId || Youtube.ytdl.validateURL(elem)) {
                    if (await queue.addId(elem))
                        added++;
                    else if (validId) {
                        const [vid] = await Youtube.search(elem, 1);
                        if (await queue.addId(vid.id))
                            added++;
                    }
                } else if (Youtube.url.PLAYLIST_REGEX.test(elem)) {
                    const match = Youtube.url.PLAYLIST_REGEX.exec(elem);
                    if (match && match[1]) {
                        const res = Youtube.url.playlist(match[1]);
                        const { data } = await Youtube.ytplaylist(res, 'id');
                        for (const id of data.playlist)
                            if (await queue.addId(id))
                                added++;
                    }
                } else {
                    const vids = await Youtube.search(elem, 1);
                    for (const song of vids)
                        if (await queue.addId(song.id))
                            added++;
                }
                if (queue.size() > 0)
                    Youtube.play(Settings, msg.guild.id, msg.channel.id);
            }
            const description = `Added ${added} song(s)`;
            const embed = new Discord.RichEmbed()
                .setColor(Hex.generate(true))
                .setDescription(description);
            Message.custom(msg, embed);
        }
    }
};