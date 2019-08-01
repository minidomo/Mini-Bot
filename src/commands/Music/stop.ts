import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';
import Client from '../../structs/Client';

const { object: settings } = Settings;

export default {
    name: 'stop',
    description: 'Stops playing music.',
    usage: 'stop <?clear>',
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
        return true;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        let otherInfo = '';
        if (args.length > 0) {
            if (args[0] === 'clear') {
                const queue = settings.get(msg.guild.id).queue;
                queue.clear();
                otherInfo += 'Queue cleared\n';
            }
        }
        const voiceConnection = Client.voiceConnections.get(msg.guild.id)!;
        const embed = new Discord.RichEmbed()
            .setColor(Util.Hex.generateNumber())
            .setDescription(`Leaving voice channel ${voiceConnection.channel}\n${otherInfo}`)
            .setFooter(`Commanded by ${msg.author.tag}`);
        voiceConnection.disconnect();
        msg.channel.send(embed);
    }
};