'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const client = require('../../structs/Client');
const Discord = require('discord.js');
const Hex = require('../../util/Hex');
const Youtube = require('../../util/Youtube');

module.exports = {
    name: 'skip',
    desc: 'Skips a song.',
    usage: 'skip',
    validate(msg) {
        if (!msg.member.voiceChannelID) {
            Message.userMustBeInVoiceChannel(msg);
            return false;
        }
        const voiceConnection = client.voiceConnections.get(msg.guild.id);
        if (!voiceConnection) {
            Message.botMustBeInVoiceChannel(msg);
            return false;
        }
        if (!voiceConnection.dispatcher) {
            Message.botMustBePlayingAudio(msg);
            return false;
        }
        return true;
    },
    execute(msg) {
        const queue = Settings.get(msg.guild.id).queue;
        let description = '';
        const vid = queue.first();
        description = `Skipping [${vid.title}](${Youtube.url.video(vid.id)}) by ${vid.author} \`${vid.duration}\``;
        const voiceConnection = client.voiceConnections.get(msg.guild.id);
        voiceConnection.dispatcher.end();
        const embed = new Discord.RichEmbed()
            .setColor(Hex.generate(true))
            .setDescription(description);
        Message.custom(msg, embed);
    }
};