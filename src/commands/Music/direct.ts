import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'direct',
    description: 'Causes the bot\'s "playing..." messages to be sent in the current channel.',
    usage: 'direct',
    validate(msg: Discord.Message) {
        const voiceConnection = Client.voice!.connections.get(msg.guild!.id);
        if (!voiceConnection) {
            Util.Message.botMustBeInVoiceChannel(msg);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const { queue } = settings.get(guild.id);
        queue.channelId = msg.channel.id;
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`"Playing..." messages will now be sent here in ${msg.channel}`);
        msg.channel.send(embed);
    }
};