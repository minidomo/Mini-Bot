import Discord = require('discord.js');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

export = {
    name: 'pause',
    description: 'Pauses the current song.',
    usage: 'pause',
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
        if (!Util.Bot.isPlayingAudio(msg.guild!.id)) {
            Util.Message.botMustBePlayingAudio(msg);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const voiceConnection = Client.voice!.connections.get(guild.id)!;
        voiceConnection.dispatcher.pause(true);
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`Paused`);
        msg.channel.send(embed);
    }
};