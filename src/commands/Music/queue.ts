import Discord from 'discord.js';
import Settings from '../../structs/Settings';
import Util from '../../util/Util';
import Client from '../../structs/Client';

const { object: settings } = Settings;

const DESCRIPTION_LIMIT = 2048;
const NAME_LIMIT = 17;

export default {
    name: 'queue',
    description: 'Shows the current queue.',
    usage: 'queue',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        const embed = new Discord.RichEmbed()
            .setColor(Util.Hex.generateNumber());
        const queue = settings.get(msg.guild.id).queue;
        const title = `${queue.size()} song(s)`;
        let description = '';
        const arr = queue.list;
        if (arr.length === 0)
            description = '¯\\\_(ツ)\_/¯';
        else {
            description = `\`${isPlaying(msg.guild.id) ? '⋆' : '•'}\` \`${Util.Transform.limitText(arr[0].title!, NAME_LIMIT)}\` \`${arr[0].duration}\`\n`;
            for (let x = 1; x < arr.length; x++) {
                const song = arr[x];
                const str = `\`${x}\` \`${Util.Transform.limitText(song.title!, NAME_LIMIT)}\` \`${song.duration}\`\n`;
                if (description.length + str.length <= DESCRIPTION_LIMIT - 3) {
                    description += str;
                } else {
                    description += '...';
                    break;
                }
            }
        }
        embed.setTitle(title)
            .setDescription(description);
        msg.channel.send(embed);
    }
};

const isPlaying = (guildId: string) => {
    const voiceConnection = Client.voiceConnections.get(guildId);
    if (voiceConnection) {
        const dispatcher = voiceConnection.dispatcher;
        if (dispatcher && !dispatcher.paused)
            return true;
    }
    return false;
};