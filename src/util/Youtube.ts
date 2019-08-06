import Logger = require('./Logger');
import Hex = require('./Hex');
import Time = require('./Time');
import Transform = require('./Transform');
import Song = require('../structs/Song');
import Settings = require('../structs/Settings');
import Client = require('../structs/Client');
import Arguments = require('../structs/Arguments');

import util = require('util');
import fs = require('fs');
import querystring = require('querystring');

import Discord = require('discord.js');
import Axios = require('axios');
import apisearch = require('youtube-search');
import ytSearch = require('yt-search');
import ytdl = require('ytdl-core');
import ytdl_discord = require('ytdl-core-discord');

const axios = Axios.default;
const httpsearch = util.promisify(ytSearch);
const search_opts = {
    type: 'video',
    safeSearch: 'none',
    maxResults: 5,
    key: process.env.YOUTUBE_API_KEY
};
const playlist_opts = {
    part: 'contentDetails',
    maxResults: 50,
    pageToken: undefined,
    key: process.env.YOUTUBE_API_KEY
};

const url = {
    query(title: string) {
        return encodeURI(`https://www.youtube.com/results?search_query=${title.split(/\s+/g).join('+')}`);
    },
    video(id: string) {
        return `https://youtu.be/${id.substring(0, 11)}`;
    },
    videoShort(id: string) {
        return `youtu.be/${id.substring(0, 11)}`;
    },
    main(data: string) {
        return `https://www.youtube.com/${data}`;
    },
    playlist(id: string) {
        return `https://www.youtube.com/playlist?list=${id}`;
    },
    PLAYLIST_REGEX: /^(?:https?:\/\/)?(?:www\.)?youtube\.com\/.*list=([\w-]+).*$/
}

const search = async (title: string, maxQueries: number, useHttp: boolean = false) => {
    search_opts.maxResults = maxQueries;
    if (search_opts.key && !useHttp) {
        try {
            const { results } = await apisearch(title, search_opts);
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
        const res = await httpsearch(title);
        if (typeof res !== 'undefined') {
            const { videos } = res;
            let ret = [];
            for (let x = 0; x < search_opts.maxResults && x < videos.length; x++) {
                const vid = videos[x];
                ret.push(new Song({
                    title: vid.title,
                    author: vid.author.name,
                    id: vid.videoId
                }));
            }
        }
    } catch (err) {
        Logger.error(`Error occured during usage of http search`);
    }
    return [];
};

let idSet: Set<string> | undefined;
const defaultOptions = { highWaterMark: 512, volume: false };

if (Arguments.saveMp3) {
    const savedIds = fs.readdirSync(`${__dirname}/../../save/songs/`)
        .filter(file => file.endsWith('.mp3'))
        .map(file => file.substr(0, 11));
    idSet = new Set<string>(savedIds);
}

const play = async (settings: Settings, guildId: string, channelId: string) => {
    const voiceConnection = Client.voice!.connections.get(guildId);
    if (!voiceConnection || voiceConnection.dispatcher) {
        return;
    }
    const guildSettings = settings.get(guildId);
    const queue = guildSettings.queue;
    const first = queue.first();
    if (!first.id)
        return;
    const removeFile = async () => {
        if (queue.downloading) {
            queue.downloading.writeStream.close();
            const { path } = queue.downloading;
            queue.downloading.writeStream.emit('close');
            try {
                await Time.delay(1000);
                fs.unlinkSync(path);
            } catch (err) {
                Logger.info('error deleting file');
            }
        }
    }
    voiceConnection.on('disconnect', async () => {
        if (Arguments.saveMp3)
            await removeFile();
    });
    const addEvents = (dispatcher: Discord.StreamDispatcher) => {
        dispatcher
            .once('start', () => {
                const vid = queue.first();
                const channel = Client.channels.get(channelId);
                if (vid.id && channel && channel.type === 'text' && !queue.quiet) {
                    const textChannel = channel as Discord.TextChannel;
                    const description = `Playing [${fixTitle(vid.title!)}](${url.video(vid.id)}) by ${vid.author} \`[${vid.duration}]\``;
                    const embed = new Discord.MessageEmbed()
                        .setColor(Hex.generateNumber())
                        .setDescription(description);
                    textChannel.send(embed);
                }
            })
            .once('finish', async () => {
                if (Arguments.saveMp3)
                    removeFile();
                if (queue.repeat.isOn()) {
                    if (queue.repeat.queue)
                        queue.move(0, queue.size() - 1);
                } else {
                    queue.poll();
                }
                if (queue.size() > 0) {
                    play(settings, guildId, channelId);
                }
            });
    };
    let dispatcher: Discord.StreamDispatcher;
    if (Arguments.saveMp3 && idSet) {
        const path = `${__dirname}/../../save/songs/${first.id}.mp3`;
        if (!idSet.has(first.id)) {
            idSet.add(first.id);
            const stream = ytdl(url.video(first.id), { filter: "audioonly", quality: "highestaudio" });
            const writeStream = stream.pipe(fs.createWriteStream(path))
                .on('open', async () => {
                    queue.download(writeStream, path);
                    await Time.delay(2000);
                    dispatcher = voiceConnection.play(path, defaultOptions);
                    addEvents(dispatcher);
                });
        } else {
            dispatcher = voiceConnection.play(path, defaultOptions);
            addEvents(dispatcher);
        }
    } else {
        const stream = await ytdl_discord(url.video(first.id));
        dispatcher = voiceConnection.play(stream, { type: 'opus', ...defaultOptions });
        addEvents(dispatcher);
    }
};

const getVideosFromPlaylist = async (id: string) => {
    const params = { playlistId: id, ...playlist_opts };
    let result: { [key: string]: any } | undefined;
    let ret: string[] = [];
    do {
        if (result && result.nextPageToken)
            params.pageToken = result.nextPageToken;
        let response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems?' + querystring.stringify(params));
        result = response.data;
        if (result) {
            for (const { contentDetails } of result.items) {
                const { videoId } = contentDetails;
                ret.push(videoId);
            }
        }
    } while (result && result.nextPageToken);
    return ret;
};

const fixTitle = (title: string) => {
    let ret = Transform.replaceAll(title, /\[/g, '⦍');
    ret = Transform.replaceAll(ret, /]/g, '⦎');
    return ret;
};

export = {
    url,
    fixTitle(title: string) {
        return fixTitle(title);
    },
    ytdl: ytdl,
    async getVideosFromPlaylist(id: string) {
        try {
            return await getVideosFromPlaylist(id);
        } catch (err) {
            return [];
        }
    },
    async search(title: string, maxQueries: number, useHttp: boolean = false) {
        return search(title, maxQueries, useHttp);
    },
    play(settings: Settings, guildId: string, channelId: string) {
        play(settings, guildId, channelId);
    }
};