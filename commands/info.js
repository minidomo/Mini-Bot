'use strict';

let Info = function () {
    this.pass = (msg, args) => {
        return true;
    };

    this.run = (msg, args) => {
        msg.channel.send('This bot was made by Mini as a fun project.');
    };
};

module.exports = new Info;