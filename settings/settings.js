'use strict';

const Structs = require('../structs/Structs');
const client = Structs.Client;
const Logger = require('../util/Logger');
const fs = require('fs');

const getSettings = () => {
    try {
        return require('./settings.json');
    } catch (err) {
        return {};
    }
};

const settingsjson = getSettings();
const settings = new Structs.Settings();
const removeGuilds = new Set(Object.keys(settingsjson));

client.on('guildCreate', guild => {
    Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
    settings.set(guild.id, new Structs.GuildSettings({ name: guild.name }));
});

client.on('guildDelete', guild => {
    Logger.info(`Deleting settings for ${guild.name} (${guild.id})`);
    settings.delete(guild.id);
});

let loadOnce = true;
const Load = () => {
    if (loadOnce) {
        loadOnce = false;
        Logger.info('Loading settings...');
        client.guilds.forEach(guild => {
            if (removeGuilds.has(guild.id)) {
                Logger.info(`Loading settings for ${guild.name} (${guild.id})`);
                removeGuilds.delete(guild.id);
                const guildSettings = new Structs.GuildSettings(settingsjson[guild.id]);
                settings.set(guild.id, guildSettings);
            } else {
                Logger.info(`Creating settings for ${guild.name} (${guild.id})`);
                settings.set(guild.id, new Structs.GuildSettings({ name: guild.name }));
            }
        });
        removeGuilds.forEach(id => {
            settings.set(id, new Structs.GuildSettings(settingsjson[id]));
        });
        Logger.info('Finished loading settings');
    }
};

let saveOnce = true;
const Save = () => {
    if (saveOnce) {
        saveOnce = false;
        removeGuilds.forEach(guild_id => {
            Logger.info(`Deleting settings for ${settings.get(guild_id).name} (${guild_id})`);
            settings.delete(guild_id);
        });
        Logger.info('Saving settings...');
        fs.writeFileSync('./settings/settings.json', settings.toJson());
        Logger.info('Finished saving settings');
    }
};

module.exports = { Settings: settings, Load, Save };