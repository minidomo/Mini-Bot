'use strict';

/**
 * @type {Map<string, Song>}
 */
let map = new Map();

/**
 * 
 * @param {Settings} Settings 
 */
const songcache = Settings => {
    Settings.forEach(guildSettings => {
        map = new Map([...map, ...guildSettings.queue.map]);
        const playlists = guildSettings.playlists;
        playlists.names().forEach(name => {
            const playlist = playlists.get(name);
            playlist.list.forEach(song => {
                map.set(song.id, song);
            });
        });
    });
};

/**
 * @param {string} id
 */
songcache.has = id => {
    return map.has(id);
};

/**
 * @param {string} id
 * @param {Song} song
 */
songcache.set = (id, song) => {
    return map.set(id, song);
};

/**
 * @param {string} id
 */
songcache.get = id => {
    return map.get(id);
};

module.exports = songcache;