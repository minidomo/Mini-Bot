'use strict';

/**
 * @typedef {object} Command
 * @property {Function<boolean>} validate
 * @property {Function<void>} execute
 */

/**
 * @typedef {object} CommandContainer
 * @property {Map<string, Command} regular
 * @property {Map<string, Command>} admin
 */

/**
 * @type {CommandContainer}
 */
const commands = {
    regular: new Map(),
    admin: new Map()
};

const Logger = require('../util/Logger');
Logger.info('Loading commands...');

const fs = require('fs');
let directories = fs.readdirSync('./commands').filter(directory => !directory.endsWith('.js'));
for (const directory of directories) {
    const commandFiles = fs.readdirSync(`./commands/${directory}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./${directory}/${file}`);
        if (directory === 'regular')
            commands.regular.set(command.name.toLowerCase(), command);
        else
            commands.admin.set(command.name.toLowerCase(), command);
    }
}

Logger.info('Finished loading commands');

module.exports = commands;