import Logger from './Logger';
import Hex from './Hex';
import Song from '../structs/Song';
import Settings from '../structs/Settings';

import util from 'util';

import Discord from 'discord.js';
import apisearch from 'youtube-search';
import ytSearch from 'yt-search';
import ytdl from 'ytdl-core';
import ytplaylist from 'youtube-playlist';

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
    PLAYLIST_REGEX: /^.*(?:youtu.be\/|list=)([^#>\&\?]*).*/
}

export default {
    url,
    ytdl: ytdl,
    ytplaylist: ytplaylist,
    async search(title: string, maxQueries: number, useHttp: boolean = false) {
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
    },
    play(client: Discord.Client, Settings: Settings, guildId: string, channelId: string) {
        const voiceConnection = client.voiceConnections.get(guildId);
        if (!voiceConnection || voiceConnection.dispatcher)
            return;
        const guildSettings = Settings.get(guildId);
        const queue = guildSettings.queue;
        const first = queue.first();
        if (!first.id)
            return;
        const stream = ytdl(url.video(first.id), { filter: 'audioonly' });
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
            const channel = client.channels.get(channelId);
            if (vid.id && channel && channel.type === 'text') {
                const textChannel = channel as Discord.TextChannel;
                const description = `Playing [${vid.title}](${url.video(vid.id)}) by ${vid.author} \`[${vid.duration}]\``;
                const embed = new Discord.RichEmbed()
                    .setColor(Hex.generateNumber())
                    .setDescription(description);
                textChannel.send(embed);
            }
        });
        dispatcher.on('end', () => {
            queue.poll();
            if (queue.size() > 0)
                this.play(client, Settings, guildId, channelId);
        });
    }
};