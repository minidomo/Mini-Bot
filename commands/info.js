'use strict';

module.exports = {
    name: 'info',
    visible: true,
    useable: true,
    desc: 'Shows information about the bot.',
    usage: 'info',
    pass(msg, obj) {
        return true;
    },
    run(msg, obj) {
        msg.channel.send('This bot was made by Mini/JB as a fun project. Source code on Github. https://github.com/MiniDomo/Mini-Bot');
    }
};