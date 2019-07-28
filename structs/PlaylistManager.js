'use strict';

const SongCollection = require('./SongCollection');

class PlaylistManager {
    /**
     * 
     * @param {object} data 
     */
    constructor(data = {}) {
        this.playlists = {};
        Object.keys(data).forEach(name => {
            this.playlists[name] = new SongCollection(data[name]);
        });
    }

    size() {
        return Object.keys(this.playlists).length;
    }

    names() {
        return Object.keys(this.playlists);
    }

    /**
     * 
     * @param {string} name 
     */
    has(name) {
        return typeof this.playlists[name] === 'object';
    }

    /**
     * 
     * @param {string} name 
     * @returns {SongCollection}
     */
    get(name) {
        return this.playlists[name];
    }

    /**
     * 
     * @param {string} curname 
     * @param {string} newname 
     * @returns {SongCollection}
     */
    change(curname, newname) {
        this.playlists[newname] = this.playlists[curname];
        delete this.playlists[curname];
        return this.playlists[newname];
    }

    /**
     * 
     * @param {string} name 
     * @returns {SongCollection}
     */
    delete(name) {
        const ret = this.playlists[name];
        delete this.playlists[name];
        return ret;
    }

    /**
     * 
     * @param {string} name 
     * @returns {SongCollection}
     */
    create(name) {
        this.playlists[name] = new SongCollection();
        return this.playlists[name];
    }

    getElement() {
        const ret = {};
        Object.keys(this.playlists).forEach(name => ret[name] = this.playlists[name].getElement());
        return ret;
    }
}

module.exports = PlaylistManager;