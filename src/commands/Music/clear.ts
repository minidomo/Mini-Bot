import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'clear',
    description: 'Clears the queue.',
    usage: 'clear',
    validate(msg: Discord.Message) {
        if (!msg.member!.voice.channelID) {
            Util.Message.userMustBeInVoiceChannel(msg);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const queue = settings.get(guild.id).queue;
        while (queue.size() > 1)
            queue.remove(1);
        const voiceConnection = Client.voice!.connections.get(guild.id);
        if (voiceConnection) {
            voiceConnection.dispatcher.end();
        } else if (queue.size() > 0) {
            queue.remove(0);
        }
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`Queue has been cleared`);
        msg.channel.send(embed);
    }
};