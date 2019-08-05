import Logger = require('../util/Logger');
import SongCache = require('../structs/SongCache');
import Settings = require('../structs/Settings');
import Client = require('../structs/Client');
import Arguments = require('../structs/Arguments');
import Time = require('../util/Time');
import fs = require('fs');

const { object: songCache } = SongCache;
const { object: settings } = Settings;

const EXIT = async (err?: any) => {
    if (err instanceof Error)
        Logger.error(err);
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
    if (Arguments.saveMp3) {
        for (const [, guildSettings] of settings) {
            const { queue } = guildSettings;
            if (queue.downloading) {
                queue.downloading.writeStream.close();
                const { path } = queue.downloading;
                queue.downloading.writeStream.emit('close');
                try {
                    await Time.delay(1000);
                    fs.unlinkSync(path);
                } catch (err) {
                    Logger.info('error deleting file');
                }
            }
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
process.on('SIGKILL', EXIT);
process.on('uncaughtException', EXIT);
process.on('unhandledRejection', EXIT);