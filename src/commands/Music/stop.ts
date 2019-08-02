import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

export = {
    name: 'stop',
    description: 'Stops playing music.',
    usage: 'stop <?clear>',
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
        return true;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        const guild = msg.guild!;
        let otherInfo = '';
        if (args.length > 0) {
            if (args[0] === 'clear') {
                const queue = settings.get(guild.id).queue;
                queue.clear();
                otherInfo += 'Queue cleared\n';
            }
        }
        const voiceConnection = Client.voice!.connections.get(guild.id)!;
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`Leaving voice channel ${voiceConnection.channel}\n${otherInfo}`)
            .setFooter(`Commanded by ${msg.author!.tag}`);
        voiceConnection.disconnect();
        msg.channel.send(embed);
    }
};