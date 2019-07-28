'use strict';

const Song = require('./Song');
const Youtube = require('../util/Youtube');
const Transform = require('../util/Transform');
const SongCache = require('./SongCache');

class SongCollection {
    /**
     * 
     * @param {object[]} data 
     */
    constructor(data = []) {
        /**
         * @type {Map<string, Song}
         */
        this.map = new Map();
        this.list = data.map(val => {
            const song = new Song(val);
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

    /**
     * 
     * @param {string} songName 
     */
    matches(songName) {
        let res = [];
        for (const song of this.list) {
            if (song.title.match(new RegExp(songName, 'gi')))
                res.push(song);
        }
        return res;
    }

    /**
     * 
     * @param {string} id 
     */
    get(id) {
        return this.map.get(id);
    }

    /**
     * @param {Song} song
     */
    add(song) {
        this.map.set(song.id, song);
        this.list.push(song);
        return this;
    }

    /**
     * 
     * @param {string} id 
     */
    async addId(id) {
        id = Youtube.ytdl.getVideoID(id);
        if (id instanceof Error)
            return false;
        let song;
        if (SongCache.has(id)) {
            song = SongCache.get(id);
        } else {
            let vidinfo;
            try {
                vidinfo = await Youtube.ytdl.getBasicInfo(id);
            } catch (err) {
                return false;
            }
            song = new Song({
                title: vidinfo.title,
                author: vidinfo.author.name,
                duration: Transform.secToHHMMSS(vidinfo.length_seconds),
                id: vidinfo.video_id
            });
            SongCache.set(song.id, song);
        }
        if (this.has(song))
            return false;
        this.add(song);
        return true;
    }

    /**
     * 
     * @param {Song|number} song 
     */
    remove(song) {
        let index = song;
        if (song instanceof Song)
            index = this.index(song);
        if (index >= 0 && index < this.list.length) {
            /**
             * @type {Song}
             */
            const ret = this.list[index];
            this.list.splice(index, 1);
            this.map.delete(ret.id);
            return ret;
        }
        return null;
    }

    /**
     * 
     * @param {string} id 
     */
    async removeId(id) {
        id = Youtube.ytdl.getVideoID(id);
        if (id instanceof Error)
            return false;
        let song;
        if (SongCache.has(id)) {
            song = SongCache.get(id);
        } else {
            let vidinfo;
            try {
                vidinfo = await Youtube.ytdl.getBasicInfo(id);
            } catch (err) {
                return false;
            }
            song = new Song({
                title: vidinfo.title,
                author: vidinfo.author.name,
                duration: Transform.secToHHMMSS(vidinfo.length_seconds),
                id: vidinfo.video_id
            });
            SongCache.set(song.id, song);
        }
        if (this.has(song)) {
            this.remove(song);
            return true;
        }
        return false;
    }

    /**
     * 
     * @param {Song} song 
     */
    has(song) {
        return this.map.has(song.id);
    }

    /**
     * 
     * @param {Song} song 
     */
    index(song) {
        return this.list.findIndex(val => val.id === song.id);
    }

    /**
     * 
     * @param {number} pos1 
     * @param {number} pos2 
     */
    swap(pos1, pos2) {
        [list[pos1], list[pos2]] = [list[pos2], list[pos1]];
    }

    /**
     * 
     * @param {number} curpos 
     * @param {number} newpos 
     */
    move(curpos, newpos) {
        const song = this.list[curpos];
        this.list.splice(curpos, 1);
        this.list.splice(newpos, 0, song);
    }

    getElement() {
        return this.list.map(song => song.getElement());
    }
}

module.exports = SongCollection;