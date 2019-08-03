import Logger = require('./Logger');
import Hex = require('./Hex');
import Song = require('../structs/Song');
import Settings = require('../structs/Settings');
import Client = require('../structs/Client');
import Arguments = require('../structs/Arguments');

import util = require('util');
import fs = require('fs');

import Discord = require('discord.js');
import apisearch = require('youtube-search');
import ytSearch = require('yt-search');
import ytdl = require('ytdl-core');
import ytplaylist = require('youtube-playlist');
import ytdl_discord = require('ytdl-core-discord');

const httpsearch = util.promisify(ytSearch);
const opts = {
    type: 'video',
    safeSearch: 'none',
    key: process.env.YOUTUBE_API_KEY,
    maxResults: 5
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
    PLAYLIST_VALID_REGEX: /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/,
    PLAYLIST_PARSE_REGEX: /[&?]list=([a-zA-Z0-9_-]+)/
}

const search = async (title: string, maxQueries: number, useHttp: boolean = false) => {
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
        const res = await httpsearch(title);
        if (typeof res !== 'undefined') {
            const { videos } = res;
            let ret = [];
            for (let x = 0; x < opts.maxResults && x < videos.length; x++) {
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
    let dispatcher: Discord.StreamDispatcher;
    if (Arguments.saveMp3 && idSet) {
        const path = `${__dirname}/../../save/songs/${first.id}.mp3`;
        if (!idSet.has(first.id)) {
            const stream = ytdl(url.video(first.id), { filter: "audioonly", quality: "highestaudio" });
            stream.pipe(fs.createWriteStream(path));
            idSet.add(first.id);
            dispatcher = voiceConnection.play(stream);
        } else {
            dispatcher = voiceConnection.play(path, defaultOptions);
        }
    } else {
        const stream = await ytdl_discord(url.video(first.id));
        dispatcher = voiceConnection.play(stream, { type: 'opus', ...defaultOptions });
    }
    dispatcher.on('error', err => {
        console.log(`[ERROR]\n${err.stack}`);
    }).on('debug', info => {
        console.log(`[DEBUG] - ${info}`);
    }).once('speaking', val => {
        console.log(`[SPEAKING] - ${val}`);
    }).once('start', () => {
        const vid = queue.first();
        const channel = Client.channels.get(channelId);
        if (vid.id && channel && channel.type === 'text') {
            const textChannel = channel as Discord.TextChannel;
            const description = `Playing [${vid.title}](${url.video(vid.id)}) by ${vid.author} \`[${vid.duration}]\``;
            const embed = new Discord.MessageEmbed()
                .setColor(Hex.generateNumber())
                .setDescription(description);
            textChannel.send(embed);
        }
    }).once('finish', () => {
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

export = {
    url,
    ytdl: ytdl,
    ytplaylist: ytplaylist,
    async search(title: string, maxQueries: number, useHttp: boolean = false) {
        return search(title, maxQueries, useHttp);
    },
    play(settings: Settings, guildId: string, channelId: string) {
        play(settings, guildId, channelId);
    }
};