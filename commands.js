class CommandObj {
    constructor(name, desc) {
        this.name = name;
        this.desc = desc;
    }
}

const Discord = require('discord.js');
const fs = require('fs');

// my other commands
const Methods = require('./methods.js');
const Connect4 = require('./connect4.js').Connect4;
const Music = require('./music.js').Music;
const SysCmd = require('./systemcommand.js').SystemCommand;

const Commands = {
    c4: {
        desc: 'Connect 4 main command. `!!c4 help` for sub-commands.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'c4')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            console.log(msg.author.id + ' ' + args);
            if (Methods.isUndefined(args))
                return;
            if (args.length === 3) {
                if (Connect4.checkIfAbleToStart(msg, args)) {
                    Connect4.startInit(msg, args);
                }
            } else if (args.length === 2) {
                if (Connect4.checkIfAbleToPlace(msg, args)) {
                    Connect4.placePiece(msg, args);
                }
            } else if (args.length === 1) {
                if (Connect4.checkIfCanFF(msg, args)) {
                    Connect4.ff(msg, args);
                } else if (args[0] === 'help') {
                    Connect4.help(msg);
                }
            }

        }
    },
    //
    help: {
        desc: 'Shows the available commands.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'help')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            let arr = [];
            Object.keys(Commands).forEach(prop => arr.push(new CommandObj(prop, Commands[prop].desc)));

            let description = '';
            arr.forEach((obj) => {
                description += '`' + obj.name + '` ' + obj.desc + '\n';
            });

            let Embed = new Discord.RichEmbed({ description: description, title: 'Commands' });
            Embed.setColor('RED');

            msg.channel.send(Embed);
        }
    },
    //
    info: {
        desc: 'Shows information about the bot.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'info')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            msg.channel.send('This bot was made by Mini as a fun project.');
        }
    },
    //
    play: {
        desc: 'Play a YouTube video. Currently only supports YouTube links.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'play')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            if (Methods.isUndefined(args))
                return;
            if (Methods.isUndefined(msg.member.voiceChannel)) {
                msg.channel.send('You must be in a voice channel to use this command.');
                return;
            }
            if (!Music.isValidURL(args)) {
                msg.channel.send('Invalid link.');
                return;
            }
            let guild = msg.guild;
            if (Methods.isUndefined(Music.Servers[guild.id]))
                Music.addNewServerID(guild.id);
            Music.addUrlToQueue(args[0], guild.id);
            msg.channel.send('Song added to queue.');
            if (!Music.isBotAlreadyConnected(guild.voiceConnection))
                Music.joinVoiceChannelAndStart(msg.member.voiceChannel, msg);
        }
    },
    //
    queue: {
        desc: 'Lists the current songs in the queue.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'queue')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            let id = msg.guild.id;
            if (Methods.isUndefined(Music.Servers[id])) {
                msg.channel.send('There are no songs in queue.');
                return;
            }
            let queue = Music.getQueue(id);
            if (queue.length === 0) {
                msg.channel.send('There are no songs in queue.');
            } else {
                let first = queue[0];
                msg.channel.send('`Current` ' + first.title + ' by ' + first.author + ' `[' + first.duration + ']`');
                for (let x = 1; x < queue.length; x++)
                    msg.channel.send('`' + x + '` ' + queue[x].title + ' by ' + queue[x].author + ' `[' + queue[x].duration + ']`');
            }
        }
    },
    randomtard: {
        desc: 'Calls Somchu a retard. Not actually random.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'randomtard')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            msg.channel.send('Somchu is a retard.');
        }
    },
    //
    repeat: {
        desc: 'Repeats the current song or queue. `!!repeat [song/queue/state]`',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'repeat')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            if (Methods.isUndefined(args))
                return;
            if (args.length !== 1)
                return;
            let guild = msg.guild;
            if (Methods.isUndefined(Music.Servers[guild.id]))
                Music.addNewServerID(guild.id);
            let server = Music.Servers[guild.id];
            if (args[0] === 'song') {
                server.repeatSong = !server.repeatSong;
                server.repeatQueue = false;
                msg.channel.send('Repeat Song set to ' + server.repeatSong + '.');
            } else if (args[0] === 'queue') {
                server.repeatQueue = !server.repeatQueue;
                server.repeatSong = false;
                msg.channel.send('Repeat Queue set to ' + server.repeatQueue + '.');
            } else if (args[0] === 'state') {
                msg.channel.send('Repeat song is set to ' + server.repeatSong + '.\nRepeat queue is set to ' + server.repeatQueue + '.');
            }
        }
    },
    //
    skip: {
        desc: 'Skips the current song in the queue.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'skip')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            if (Methods.isUndefined(msg.member.voiceChannel)) {
                msg.channel.send('You must be in a voice channel to use this command.');
                return;
            }
            let id = msg.guild.id;
            if (!Methods.isUndefined(Music.Servers[id])) {
                Music.endCurrentAudio(id);
                msg.channel.send('Skipped song.');
            }
        }
    },
    //
    speak: {
        desc: 'The bot speaks.',
        execute: function (msg, args) {
            fs.readFile('speak.txt', 'utf8', (err, data) => {
                if (data.length === 0)
                    msg.channel.send('I have nothing to say right now.');
                else
                    msg.channel.send(data);
            });
        }
    },
    //
    stop: {
        desc: 'Stops the song from playing and exits the bot.',
        execute: function (msg, args) {
            if (!SysCmd.canUseCommand(msg.author.id, 'stop')) {
                msg.channel.send('You cannot use this command.');
                return;
            }
            if (Methods.isUndefined(msg.member.voiceChannel)) {
                msg.channel.send('You must be in a voice channel to use this command.');
                return;
            }
            let guild = msg.guild;
            if (Methods.isUndefined(Music.Servers[guild.id])) {
                msg.channel.send('There\'s nothing to stop.');
                return;
            }
            Music.Servers[guild.id].repeatSong = false;
            Music.Servers[guild.id].repeatQueue = false;
            Music.removeAllSongs(guild.id);
            Music.endDispatcher(guild.id);
            msg.channel.send('Removing all songs from queue.');
            if (Music.isBotAlreadyConnected(guild.voiceConnection))
                guild.voiceConnection.disconnect();
        }
    },
    //
    syscmd: {
        desc: 'Accesses the system and grants or denies power to use commands of Mini Bot. `!!syscmd [grant/deny] [user] [command]`',
        execute: function (msg, args) {
            if (Methods.isUndefined(args))
                return;
            if (args.length === 3) {
                if (SysCmd.isAdvancedUser(msg.author.id)) {
                    if (SysCmd.areValidArgs(args)) {
                        if (SysCmd.execute(args)) {
                            msg.channel.send('Action confirmed.');
                        } else {
                            msg.channel.send('You cannot use this command on yourself.');
                        }
                    } else {
                        msg.channel.send('Invalid arguments.');
                    }
                } else {
                    msg.channel.send('You do not have authority to use this command.');
                }
            }
        }
    }
};

module.exports = {
    Commands: Commands
};