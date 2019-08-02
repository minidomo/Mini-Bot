import Logger = require('../util/Logger');
import SongCache = require('../structs/SongCache');
import Settings = require('../structs/Settings');
import Client = require('../structs/Client');
import Arguments = require('../structs/Arguments');

const { object: songCache } = SongCache;
const { object: settings } = Settings;

let entered = false;

const EXIT = async (err?: any) => {
    if (err instanceof Error)
        Logger.error(err);
    if (!entered) {
        entered = true;
        if (Arguments.saveSongCache && songCache.loaded) {
            Logger.info('Saving songcache.json...');
            songCache.save();
            Logger.info('Successfully saved songcache.json');
        }
        if (settings.loaded) {
            Logger.info('Saving settings.json...');
            settings.save();
            Logger.info('Successfully saved settings.json');
        }
    }
    if (Client.voice) {
        Client.voice.connections.keyArray().forEach(guildId => {
            const guild = Client.guilds.get(guildId)!;
            Logger.info(`Disconnecting from ${guild.name} (${guild.id})`);
            Client.voice!.connections.get(guild.id)!.disconnect();
        });
    }
    Logger.info('Shutting down...');
    process.exit();
};

process.on('SIGINT', EXIT);
process.on('SIGTERM', EXIT);
process.on('uncaughtException', EXIT);
process.on('unhandledRejection', EXIT);