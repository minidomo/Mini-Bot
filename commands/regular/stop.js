'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const client = require('../../structs/Client');
const Discord = require('discord.js');
const Hex = require('../../util/Hex');

module.exports = {
    name: 'stop',
    desc: 'Stops playing music.',
    usage: 'stop <?clear>',
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
        return true;
    },
    execute(msg, { args }) {
        let otherInfo = '';
        if (args.length > 0) {
            if (args[0] === 'clear') {
                const queue = Settings.get(msg.guild.id).queue;
                queue.clear();
                otherInfo += 'Queue cleared\n';
            }
        }
        const voiceConnection = client.voiceConnections.get(msg.guild.id);
        const embed = new Discord.RichEmbed()
            .setColor(Hex.generate(true))
            .setDescription(`Leaving voice channel ${voiceConnection.channel}\n${otherInfo}`)
            .setFooter(`Commanded by ${msg.author.tag}`);
        voiceConnection.disconnect();
        Message.custom(msg, embed);
    }
};