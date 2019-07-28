'use strict';

const Song = require('../structs/Song');
const Logger = require('./Logger');
const util = require('util');
const apisearch = require('youtube-search');
const httpsearch = util.promisify(require('yt-search'));
const opts = {
    type: 'video',
    safeSearch: 'none',
    key: process.env.YOUTUBE_API_KEY
};

const ytdl = require('ytdl-core');
const ytplaylist = require('youtube-playlist');

const client = require('../structs/Client');
const Discord = require('discord.js');
const Hex = require('./Hex');

const url = {
    /**
     * 
     * @param {string} title 
     */
    query(title) {
        return encodeURI(`https://www.youtube.com/results?search_query=${title.split(/\s+/g).join('+')}`);
    },
    /**
     * 
     * @param {string} id 
     */
    video(id) {
        return `https://youtu.be/${id.substring(0, 11)}`;
    },
    /**
     * 
     * @param {string} id 
     */
    videoShort(id) {
        return `youtu.be/${id.substring(0, 11)}`;
    },
    /**
     * 
     * @param {string} data 
     */
    main(data) {
        return `https://www.youtube.com/${data}`;
    },
    /**
     * 
     * @param {string} id 
     */
    playlist(id) {
        return `https://www.youtube.com/playlist?list=${id}`;
    },
    PLAYLIST_REGEX: /^.*(?:youtu.be\/|list=)([^#>\&\?]*).*/
};

module.exports = {
    url,
    /**
     * 
     * @param {string} title 
     * @param {number} maxQueries
     * @param {boolean}  useHttp
     * @returns {Promise<Song[]>}
     */
    async search(title, maxQueries, useHttp = false) {
        opts.maxResults = maxQueries;
        if (opts.key && !useHttp) {
            try {
                const { results } = await apisearch(title, opts);
                let ret = [];
                for (const vid of results) {
                    ret.push(new Song({
                        title: vid.title,
                        author: vid.channelTitle,
                        id: vid.id
                    }));
                }
                return ret;
            } catch (err) {
                Logger.error(`Error occured during usage of youtube-search, switching to http search`);
            }
        }
        try {
            const { videos } = await httpsearch(title);
            let ret = [];
            for (let x = 0; x < opts.maxResults && x < video.length; x++) {
                const vid = videos[x];
                ret.push(new Song({
                    title: vid.title,
                    author: vid.author.name,
                    id: vid.videoId
                }));
            }
        } catch (err) {
            Logger.error(`Error occured during usage of http search`);
        }
        return [];
    },
    /**
     * 
     * @param {Settings} Settings
     * @param {string} guild_id 
     * @param {string} channel_id 
     */
    play(Settings, guild_id, channel_id) {
        const voiceConnection = client.voiceConnections.get(guild_id);
        if (voiceConnection && voiceConnection.dispatcher)
            return;
        const queue = Settings.get(guild_id).queue;
        const stream = ytdl(url.video(queue.first().id), { filter: 'audioonly' });
        const dispatcher = voiceConnection.playStream(stream);
        dispatcher.on('error', err => {
            console.log(`[ERROR]\n${err.stack}`);
        });
        dispatcher.on('debug', info => {
            console.log(`[DEBUG] - ${info}`);
        });
        dispatcher.on('speaking', val => {
            console.log(`[SPEAKING] - ${val}`);
        })
        dispatcher.on('start', () => {
            const vid = queue.first();
            const channel = client.channels.get(channel_id);
            const description = `Playing [${vid.title}](${url.video(vid.id)}) by ${vid.author} \`[${vid.duration}]\``;
            const embed = new Discord.RichEmbed()
                .setColor(Hex.generate(true))
                .setDescription(description);
            channel.send(embed);
        });
        dispatcher.on('end', () => {
            queue.poll();
            if (queue.size() > 0)
                this.play(Settings, guild_id, channel_id);
        });
    },
    ytdl: ytdl,
    ytplaylist: ytplaylist
};