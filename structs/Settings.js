'use strict';

const GuildSettings = require('./GuildSettings');

/**
 * @typedef {GuildSettings} GuildSettings
 */

/**
 * @extends {Map<string, GuildSettings>}
 */
class Settings extends Map {
    constructor() {
        super();
    }

    toJson() {
        const obj = {};
        this.forEach((guildsettings, id) => obj[id] = guildsettings.getElement());
        return JSON.stringify(obj, null, 4);
    }
}

module.exports = Settings;