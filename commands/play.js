'use strict';

const servers = require('../config').servers.audio;
const ytdl = require('ytdl-core');
const Search = require('./search');

const secToHHMMSS = sec => new Date(1000 * sec).toISOString().substr(11, 8);

const addURL = (msg, URL) => {
    ytdl.getBasicInfo(URL, (err, info) => {
        if (!err) {
            const { queue, currentVideo } = servers.get(msg.guild.id);
            queue.push({
                url: info.video_url,
                title: info.title,
                author: info.author.name,
                duration: secToHHMMSS(info.length_seconds)
            });
            const last = queue.length - 1;
            msg.channel.send(`Added **${queue[last].title}** by ${queue[last].author} \`[${queue[last].duration}]\``);
            if (!currentVideo)
                play(msg.guild);
        } else {
            msg.logger.error(err);
            msg.channel.send('An error has occurred.');
        }
    });
};

const play = guild => {
    const server = servers.get(guild.id);
    server.currentVideo = server.queue[0];
    server.channel.send(`Now playing **${server.currentVideo.title}** by ${server.currentVideo.author} \`[${server.currentVideo.duration}]\``);
    guild.voiceConnection.playStream(ytdl(server.currentVideo.url, { filter: 'audioonly', quality: 'highestaudio' }));
    server.queue.shift();
    guild.voiceConnection.dispatcher.on('end', () => {
        if (server.repeat.queue)
            server.queue.push(server.currentVideo);
        else if (server.repeat.current)
            server.queue.splice(0, 0, server.currentVideo);
        server.currentVideo = null;
        if (server.queue.length > 0)
            play(guild);
    });
};

module.exports = {
    name: 'play',
    visible: true,
    useable: true,
    desc: 'Adds a video to the queue.',
    usage: 'play <url|video title>',
    pass(msg, obj) {
        if (!msg.member.voiceChannel) {
            msg.channel.send('You must be in a voice channel to use this command.');
            return false;
        }
        return Search.pass(msg, obj);
    },
    run(msg, obj) {
        const { args } = obj;
        if (!ytdl.validateURL(args[0])) {
            Search.run(msg, obj, this.run);
        } else {
            let guild = msg.guild.id;
            if (!servers.has(guild))
                servers.set(msg.guild.id, {
                    queue: [],
                    repeat: { current: false, queue: false },
                    channel: msg.channel,
                    currentVideo: null,
                });
            if (!msg.guild.voiceConnection)
                msg.member.voiceChannel.join().then(connection => addURL(msg, args[0])).catch(err => { msg.logger.error(err); msg.channel.send('An error has occured. Please check console.'); });
            else
                addURL(msg, args[0]);
        }
    }
};