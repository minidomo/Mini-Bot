import Structs = require('../structs/Structs');
import Logger = require('../util/Logger');

const { Client, Settings, GuildSettings } = Structs;
const { object: settings } = Settings;

Client.on('guildCreate', guild => {
    if (settings.has(guild.id)) {
        const guildSettings = settings.get(guild.id);
        Logger.info(`Syncing settings for ${guild.name} (${guild.id})`);
        guildSettings.name = guild.name;
    } else {
        Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
        settings.set(guild.id, new GuildSettings({ name: guild.name }));
    }
});