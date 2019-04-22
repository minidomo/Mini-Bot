'use strict';

let Help = function () {
    this.pass = (msg, args) => {
        return true;
    };

    this.run = (msg, args) => {
        let config = require('../config');
        let commands = config.commands;
        let fulldesc = '';
        let func = prop => commands[prop].visible ? `\` ${commands[prop].usage}\` ${commands[prop].desc}\n` : '';
        Object.keys(commands).forEach(prop => fulldesc += func(prop));
        let embed = new (require('discord.js')).RichEmbed({ description: fulldesc, title: `Commands | Prefix: ${config.prefix}` });
        embed.setColor('RED');
        msg.channel.send(embed);
    };
};

module.exports = new Help;