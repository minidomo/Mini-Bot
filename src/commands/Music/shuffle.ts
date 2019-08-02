import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'shuffle',
    description: 'Shuffles the queue.',
    usage: 'shuffle',
    validate(msg: Discord.Message) {
        if (!msg.member!.voice.channelID) {
            Util.Message.userMustBeInVoiceChannel(msg);
            return false;
        }
        const voiceConnection = Client.voice!.connections.get(msg.guild!.id);
        if (!voiceConnection) {
            Util.Message.botMustBeInVoiceChannel(msg);
            return false;
        }
        if (settings.get(msg.guild!.id).queue.size() < 2) {
            Util.Message.queueMustBeSize(msg, 3);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message) {
        const { queue } = settings.get(msg.guild!.id);
        queue.shuffle(1, queue.size() - 1);
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription('Shuffled the queue!');
        msg.channel.send(embed);
    }
};