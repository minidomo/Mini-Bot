'use strict';

const client = require('../structs/Client');
const Logger = require('../util/Logger');
const { Settings, Load } = require('../settings/settings');
const SongCache = require('../structs/SongCache');

client.once('ready', () => {
    Load();
    SongCache(Settings);
    client.user.setActivity('Improved Mini Bot');
    Logger.info(`Logged in as ${client.user.tag}`);
});