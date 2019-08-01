import Structs from '../structs/Structs';
import Logger from '../util/Logger';

const { Client, Settings } = Structs;
const { object: settings } = Settings;

Client.on('guildCreate', guild => {
    Logger.info(`Deleting settings for ${guild.name} (${guild.id})`);
    settings.delete(guild.id);
});