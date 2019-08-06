import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import Client = require('../../structs/Client');
import Song = require('../../structs/Song');

const { object: settings } = Settings;

const DESCRIPTION_LIMIT = 2048;
const NAME_LIMIT = 70;

export = {
    name: 'queue',
    description: 'Shows the current queue starting at a given position.',
    usage: 'queue <?position>',
    validate(msg: Discord.Message, { args }: { base: string, args: string[] }) {
        if (args.length > 0 && !/^\d+$/.test(args[0])) {
            Util.Message.correctUsage(msg, this.usage);
            return false;
        }
        return true;
    },
    execute(msg: Discord.Message, { args }: { base: string, args: string[] }) {
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
            let startPos = 0;
            if (args.length > 0) {
                const pos = parseInt(args[0]);
                if (pos >= 0 && pos <= queue.size() - 1)
                    startPos = pos;
            }
            if (startPos === 0) {
                let title = Util.Youtube.fixTitle(arr[0].title!);
                title = Util.Transform.limitText(title, NAME_LIMIT);
                description = `\`${isPlaying(guild.id) ? '⋆' : '•'}\` [\`${title}\`](${Util.Youtube.url.video(arr[0].id!)}) \`${arr[0].duration}\`\n`;
                startPos++;
            }
            for (let x = startPos; x < arr.length; x++) {
                const song = arr[x];
                let title = Util.Youtube.fixTitle(song.title!);
                title = Util.Transform.limitText(title, NAME_LIMIT);
                const str = `\`${x}\` [\`${title}\`](${Util.Youtube.url.video(song.id!)}) \`${song.duration}\`\n`;
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