'use strict';

const servers = require('../config').servers.audio;
const ytdl = require('ytdl-core');

let Play = function () {
    this.pass = (msg, args) => {
        if (!isGood(msg, args, 1))
            return false;
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        if (!ytdl.validateURL(args[0])) {
            msg.channel.send(`<${args[0]}> is not a valid YouTube url.`);
            return false;
        }
        return true;
    };

    this.run = (msg, args) => {
        let guild = msg.guild.id;
        if (!servers[guild]) {
            servers[guild] = {};
            servers[guild].queue = [];
            servers[guild].repeat = { song: false, queue: false };
        }
        if (!msg.guild.voiceConnection)
            msg.member.voiceChannel.join().then(connection => addURL(msg, args[0]));
        else
            addURL(msg, args[0]);
    };
};

let isGood = (msg, args, lim) => {
    if (args.length === lim)
        return true;
    msg.channel.send(args.length > lim ? 'Too many arguments.' : 'Not enough arguments.');
    return false;
};
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
                play(msg);
        } else {
            msg.channel.send('An error has occurred.');
        }
    });
};
let play = msg => {
    let server = servers[msg.guild.id];
    msg.channel.send(`Now playing **${server.queue[0].title}** by ${server.queue[0].author} \`[${server.queue[0].duration}]\``);
    server.dispatcher = msg.guild.voiceConnection.playStream(ytdl(server.queue[0].url, { filter: 'audioonly', quality: 'highestaudio' }));
    server.dispatcher.on('end', () => {
        if (server.repeat.song || server.repeat.queue) {
            if (server.repeat.queue)
                server.queue.push(server.queue.shift());
        } else {
            server.queue.shift();
        }
        if (server.queue.length > 0)
            play(msg);
    });
};
module.exports = new Play;