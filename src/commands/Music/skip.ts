import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'skip',
    description: 'Skips the current song.',
    usage: 'skip',
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
        if (!voiceConnection.dispatcher) {
            Util.Message.botMustBePlayingAudio(msg);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const queue = settings.get(guild.id).queue;
        let description = '';
        const vid = queue.first();
        description = `Skipping [${vid.title}](${Util.Youtube.url.video(vid.id!)}) by ${vid.author} \`${vid.duration}\``;
        const voiceConnection = Client.voice!.connections.get(guild.id)!;
        voiceConnection.dispatcher.end();
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(description);
        msg.channel.send(embed);
    }
};