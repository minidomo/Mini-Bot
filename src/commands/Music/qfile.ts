import Discord = require('discord.js');
import Settings = require('../../structs/Settings');
import Util = require('../../util/Util');
import fs = require('fs');

const { object: settings } = Settings;

export = {
    name: 'qfile',
    description: 'Returns a file containing the queue.',
    usage: 'qfile',
    validate(msg: Discord.Message) {
        const queue = settings.get(msg.guild!.id).queue;
        if (queue.size() === 0) {
            Util.Message.queueIsEmpty(msg);
            return false;
        }
        return true;
    },
    async execute(msg: Discord.Message) {
        const guild = msg.guild!;
        const filename = `${guild.id}-QUEUE-current.md`;
        let body = '| Position | Video | Author | Duration |\n| :-: | - | - | - |\n';
        const queue = settings.get(guild.id).queue;
        queue.list.forEach((song, index) => {
            body += `| ${index} | [${song.title}](${Util.Youtube.url.video(song.id!)}) | ${song.author} | \`${song.duration}\` |\n`;
        });
        const path = `./${filename}`;
        fs.writeFileSync(path, body);
        await msg.channel.send({
            files: [{
                attachment: path,
                name: filename
            }]
        });
        if (fs.existsSync(path))
            fs.unlinkSync(path);
    }
};