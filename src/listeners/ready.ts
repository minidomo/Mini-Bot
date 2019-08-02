import Logger = require('../util/Logger');
import Structs = require('../structs/Structs');

const { Client, SongCache, Settings, Arguments } = Structs;
const { object: songCache } = SongCache;
const { object: settings } = Settings;

Client.once('ready', () => {
    Client.user!.setActivity('@me help');
    Logger.info('Loading settings.json...');
    settings.load(Logger);
    Logger.info('Successfully loaded settings.json');
    if (Arguments.saveSongCache) {
        Logger.info('Loading songcache.json...');
        songCache.load(settings);
        Logger.info('Successfully loaded songcache.json');
    }
    Logger.info(`Logged in as ${Client.user!.tag}`);
});