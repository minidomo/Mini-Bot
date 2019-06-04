'use strict';

const servers = require('../config').servers.audio;
const ytdl = require('ytdl-core');
const CommandsUtil = require('../util/commands');
const Search = require('./search');

class Play {
    static pass(msg, args) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        return Search.pass(msg, args);
    }

    static run(msg, args) {
        if (!ytdl.validateURL(args[0])) {
            Search.run(msg, args, this.run);
        } else {
            let guild = msg.guild.id;
            if (!servers[guild]) {
                servers[guild] = {};
                servers[guild].queue = [];
                servers[guild].repeat = { song: false, queue: false };
            }
            if (!servers[guild].channel)
                servers[guild].channel = msg.channel;
            if (!msg.guild.voiceConnection)
                msg.member.voiceChannel.join().then(connection => addURL(msg, args[0])).catch(err => { console.error(err); msg.channel.send('An error has occured. Please check console.'); });
            else
                addURL(msg, args[0]);
        }
    };
}
let secToHHMMSS = sec => new Date(1000 * sec).toISOString().substr(11, 8);
let addURL = (msg, URL) => {
    ytdl.getBasicInfo(URL, (err, info) => {
        if (!err) {
            let queue = servers[msg.guild.id].queue;
            queue.push({
                url: info.video_url,
                title: info.title,
                author: info.author.name,
                duration: secToHHMMSS(info.length_seconds)
            });
            let last = queue.length - 1;
            msg.channel.send(`Added **${queue[last].title}** by ${queue[last].author} \`[${queue[last].duration}]\``);
            if (queue.length === 1)
                play(msg.guild);
        } else {
            console.error(err);
            msg.channel.send('An error has occurred.');
        }
    });
};
let play = guild => {
    let server = servers[guild.id];
    server.channel.send(`Now playing **${server.queue[0].title}** by ${server.queue[0].author} \`[${server.queue[0].duration}]\``);
    server.dispatcher = guild.voiceConnection.playStream(ytdl(server.queue[0].url, { filter: 'audioonly', quality: 'highestaudio' }));
    server.dispatcher.on('end', () => {
        if (server.repeat.song || server.repeat.queue) {
            if (server.repeat.queue)
                server.queue.push(server.queue.shift());
        } else {
            server.queue.shift();
        }
        if (server.queue.length > 0)
            play(guild);
    });
};
module.exports = Play;