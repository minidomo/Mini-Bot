import Song = require('./Song');
import SongCache = require('./SongCache');
import Youtube = require('../util/Youtube');
import Transform = require('../util/Transform');

const { object: songCache } = SongCache;

class SongCollection {
    map: Map<string, Song>;
    list: Song[];

    constructor(data: object[] = []) {
        this.map = new Map();
        this.list = data.map(val => {
            const song = new Song(val);
            if (song.id)
                this.map.set(song.id, song);
            return song;
        });
    }

    clear() {
        this.map.clear();
        this.list = [];
    }

    first() {
        return this.list[0];
    }

    poll() {
        return this.remove(0);
    }

    size() {
        return this.list.length;
    }

    matches(songName: string) {
        let res = [];
        for (const song of this.list) {
            if (song.title && song.title.match(new RegExp(songName, 'gi')))
                res.push(song);
        }
        return res;
    }

    get(id: string) {
        return this.map.get(id);
    }

    add(song: Song) {
        if (song.id)
            this.map.set(song.id, song);
        this.list.push(song);
        return this;
    }

    async addId(val: string) {
        let id = val;
        if (!Youtube.ytdl.validateID(val)) {
            const res = Youtube.ytdl.getVideoID(val);
            if (res instanceof Error)
                return false;
            id = res;
        }
        let song = songCache.get(id);
        if (!song) {
            let vidinfo;
            try {
                vidinfo = await Youtube.ytdl.getBasicInfo(id);
            } catch (err) {
                return false;
            }
            song = new Song({
                title: vidinfo.player_response.videoDetails.title,
                author: vidinfo.player_response.videoDetails.author,
                duration: Transform.secToHHMMSS(vidinfo.player_response.videoDetails.lengthSeconds),
                id: vidinfo.player_response.videoDetails.videoId
            });
            if (song.id)
                songCache.set(song.id, song);
        }
        if (this.has(song))
            return false;
        this.add(song);
        return true;
    }

    async addInput(input: string[]) {
        return await this.modify(input, true);
    }

    remove(val: Song | number) {
        let index = val instanceof Song ? this.index(val) : val;
        if (index >= 0 && index < this.list.length) {
            const ret = this.list[index];
            this.list.splice(index, 1);
            if (ret.id)
                this.map.delete(ret.id);
            return ret;
        }
        return null;
    }

    async removeId(val: string) {
        let id = Youtube.ytdl.getVideoID(val);
        if (id instanceof Error)
            return false;
        let song = songCache.get(id);
        if (!song) {
            let vidinfo;
            try {
                vidinfo = await Youtube.ytdl.getBasicInfo(val);
            } catch (err) {
                return false;
            }
            song = new Song({
                title: vidinfo.title,
                author: vidinfo.author.name,
                duration: Transform.secToHHMMSS(vidinfo.length_seconds),
                id: vidinfo.video_id
            });
            if (song.id)
                songCache.set(song.id, song);
        }
        if (this.has(song)) {
            this.remove(song);
            return true;
        }
        return false;
    }

    async removeInput(input: string[]) {
        return await this.modify(input, false);
    }

    async modify(input: string[], add: boolean) {
        let count = 0;
        const func = add ? this.addId.bind(this) : this.removeId.bind(this);
        for (const elem of input) {
            const validId = Youtube.ytdl.validateID(elem);
            const possibleUrl = Transform.ensureFormatUrl(elem);
            if (validId || Youtube.ytdl.validateURL(possibleUrl)) {
                if (await func(validId ? elem : possibleUrl))
                    count++;
                else if (validId) {
                    const [vid] = await Youtube.search(elem, 1);
                    if (await func(vid.id!))
                        count++;
                }
            } else if (Youtube.url.PLAYLIST_VALID_REGEX.test(possibleUrl)) {
                const match = Youtube.url.PLAYLIST_PARSE_REGEX.exec(possibleUrl);
                if (match && match[1]) {
                    const res = Youtube.url.playlist(match[1]);
                    const { data } = await Youtube.ytplaylist(res, 'id');
                    for (const id of data.playlist)
                        if (await func(id as string))
                            count++;
                }
            } else {
                const vids = await Youtube.search(elem, 1);
                for (const song of vids)
                    if (await func(song.id!))
                        count++;
            }
        }
        return count;
    }

    has(song: Song) {
        if (song.id)
            return this.map.has(song.id);
        return false;
    }

    index(song: Song) {
        return this.list.findIndex(val => val.id === song.id);
    }

    swap(pos1: number, pos2: number) {
        [this.list[pos1], this.list[pos2]] = [this.list[pos2], this.list[pos1]];
    }

    move(curpos: number, newpos: number) {
        const song = this.list[curpos];
        this.list.splice(curpos, 1);
        this.list.splice(newpos, 0, song);
    }

    shuffle(firstPos: number, secondPos: number) {
        const fpos = Math.max(0, firstPos);
        const spos = Math.min(this.size() - 1, secondPos);
        const repetitions = (spos - fpos + 1) * 5;
        for (let x = 0; x < repetitions; x++) {
            const first = random(fpos, spos);
            const second = random(fpos, spos);
            this.swap(first, second);
        }
    }

    getElement() {
        return this.list.filter(song => song.author && song.duration && song.id && song.title)
            .map(song => song.getElement());
    }
}

const random = (r1: number, r2: number) => {
    return Math.floor(Math.random() * (r2 - r1 + 1)) + r1;
};

export = SongCollection;