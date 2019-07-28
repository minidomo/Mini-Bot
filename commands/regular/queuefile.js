'use strict';

const { Settings } = require('../../settings/settings');
const Message = require('../../util/Message');
const Youtube = require('../../util/Youtube');
const fs = require('fs');

module.exports = {
    name: 'queuefile',
    desc: 'Returns a file containing the queue.',
    usage: 'queuefile',
    validate(msg) {
        const queue = Settings.get(msg.guild.id).queue;
        if (queue.size() === 0) {
            Message.queueIsEmpty(msg);
            return false;
        }
        return true;
    },
    async execute(msg) {
        const filename = `${msg.guild.id}-QUEUE-current.md`;
        let body = '| Position | Video | Author | Duration |\n| :-: | - | - | - |\n';
        const queue = Settings.get(msg.guild.id).queue;
        queue.list.forEach((song, index) => {
            body += `| ${index} | [${song.title}](${Youtube.url.video(song.id)}) | ${song.author} | \`${song.duration}\` |\n`;
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