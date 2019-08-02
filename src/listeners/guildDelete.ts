import Structs = require('../structs/Structs');
import Logger = require('../util/Logger');

const { Client, Settings } = Structs;
const { object: settings } = Settings;

Client.on('guildCreate', guild => {
    Logger.info(`Deleting settings for ${guild.name} (${guild.id})`);
    settings.delete(guild.id);
});