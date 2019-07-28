'use strict';

const PlaylistManager = require('./PlaylistManager');
const SongCollection = require('./SongCollection');

class GuildSettings {
    /**
     * 
     * @param {object} data 
     * @param {string} data.name
     * @param {string} data.prefix;
     * @param {object[]} data.queue
     * @param {object} data.playlists
     */
    constructor(data = {}) {
        this.name = data.name;
        this.prefix = data.prefix || '!!';
        this.queue = new SongCollection(data.queue);
        this.playlists = new PlaylistManager(data.playlists);
    }

    /**
     * 
     * @param {object} data 
     * @param {string} data.name
     * @param {string} data.prefix;
     */
    set(data = {}) {
        if (data.name)
            this.name = data.name;
        if (data.prefix)
            this.prefix = data.prefix;
    }

    getElement() {
        return {
            name: this.name,
            prefix: this.prefix,
            queue: this.queue.getElement(),
            playlists: this.playlists.getElement()
        };
    }
}

module.exports = GuildSettings;