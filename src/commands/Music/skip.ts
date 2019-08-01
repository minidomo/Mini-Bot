import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';
import Client from '../../structs/Client';

const { object: settings } = Settings;

export default {
    name: 'skip',
    description: 'Skips the current song.',
    usage: 'skip',
    validate(msg: Discord.Message) {
        if (!msg.member.voiceChannelID) {
            Util.Message.userMustBeInVoiceChannel(msg);
            return false;
        }
        const voiceConnection = Client.voiceConnections.get(msg.guild.id);
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
        const queue = settings.get(msg.guild.id).queue;
        let description = '';
        const vid = queue.first();
        description = `Skipping [${vid.title}](${Util.Youtube.url.video(vid.id!)}) by ${vid.author} \`${vid.duration}\``;
        const voiceConnection = Client.voiceConnections.get(msg.guild.id)!;
        voiceConnection.dispatcher.end();
        const embed = new Discord.RichEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(description);
        msg.channel.send(embed);
    }
};