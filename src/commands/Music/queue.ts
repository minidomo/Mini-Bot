import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');

const { object: settings } = Settings;

const DESCRIPTION_LIMIT = 2048;
const NAME_LIMIT = 17;

export = {
    name: 'queue',
    description: 'Shows the current queue.',
    usage: 'queue',
    validate() {
        return true;
    },
    execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const embed = new Discord.MessageEmbed()
            .setColor(Util.Hex.generateNumber());
        const queue = settings.get(guild.id).queue;
        const title = `${queue.size()} song(s)`;
        let description = '';
        const arr = queue.list;
        if (arr.length === 0)
            description = '¯\\\_(ツ)\_/¯';
        else {
            description = `\`${isPlaying(guild.id) ? '⋆' : '•'}\` \`${Util.Transform.limitText(arr[0].title!, NAME_LIMIT)}\` \`${arr[0].duration}\`\n`;
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
    const voiceConnection = Client.voice!.connections.get(guildId);
    if (voiceConnection) {
        const dispatcher = voiceConnection.dispatcher;
        if (dispatcher && !dispatcher.paused)
            return true;
    }
    return false;
};