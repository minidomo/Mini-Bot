import Logger from '../util/Logger';
import SongCache from '../structs/SongCache';
import Settings from '../structs/Settings';
import Client from '../structs/Client';

const { object: songCache } = SongCache;
const { object: settings } = Settings;

let entered = false;

const EXIT = async (err?: any) => {
    if (err instanceof Error)
        Logger.error(err);
    if (!entered) {
        entered = true;
        if (songCache.loaded) {
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
    Client.voiceConnections.keyArray().forEach(guildId => {
        const guild = Client.guilds.get(guildId)!;
        Logger.info(`Disconnecting from ${guild.name} (${guild.id})`);
        Client.voiceConnections.get(guild.id)!.disconnect();
    });
    Logger.info('Shutting down...');
    process.exit();
};

process.on('SIGINT', EXIT);
process.on('SIGTERM', EXIT);
process.on('uncaughtException', EXIT);
process.on('unhandledRejection', EXIT);