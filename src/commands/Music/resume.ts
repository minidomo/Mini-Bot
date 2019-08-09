import Discord = require('discord.js');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

export = {
    name: 'resume',
    description: 'Resumes the current song.',
    usage: 'resume',
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
        if (!Util.Bot.isPaused(msg.guild!.id)) {
            Util.Message.botMustBePaused(msg);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const voiceConnection = Client.voice!.connections.get(guild.id)!;
        voiceConnection.dispatcher.resume();
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`Resumed`);
        msg.channel.send(embed);
    }
};