import Song from './Song';
import SongCache from './SongCache';
import ytdl from 'ytdl-core';
import Transform from '../util/Transform';

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
        if (!ytdl.validateID(val)) {
            const res = ytdl.getVideoID(val);
            if (res instanceof Error)
                return false;
            id = res;
        }
        let song = songCache.get(id);
        if (!song) {
            let vidinfo;
            try {
                vidinfo = await ytdl.getBasicInfo(id);
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
        let id = ytdl.getVideoID(val);
        if (id instanceof Error)
            return false;
        let song = songCache.get(id);
        if (!song) {
            let vidinfo;
            try {
                vidinfo = await ytdl.getBasicInfo(val);
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

    getElement() {
        return this.list.filter(song => song.author && song.duration && song.id && song.title)
            .map(song => song.getElement());
    }
}

export default SongCollection;