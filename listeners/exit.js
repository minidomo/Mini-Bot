'use strict';

const Logger = require('../util/logger');
const { Save } = require('../settings/settings');
const client = require('../structs/Client');

const EXIT = async err => {
    if (err instanceof Error)
        Logger.error(err);
    Save();
    client.voiceConnections.keyArray().forEach(guild_id => {
        const guild = client.guilds.get(guild_id);
        Logger.info(`Disconnecting from ${guild.name} (${guild.id})`);
        client.voiceConnections.get(guild.id).disconnect();
    });
    Logger.info('Shuting down bot');
    process.exit();
};

process.on('SIGINT', EXIT);
process.on('SIGTERM', EXIT);
process.on('uncaughtException', EXIT);
process.on('unhandledRejection', EXIT);