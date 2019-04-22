const ytdl = require('ytdl-core');

const Methods = require('./methods.js');

const Music = {
    Servers: {},
    isValidURL: function (args) {
        if (args[0].length > 2) {
            if (args[0].startsWith('<') && args[0].endsWith('>'))
                args[0].substring(1, args[0].length - 1);
            return ytdl.validateURL(args[0]);
        }
        return false;
    },
    addNewServerID: function (id) {
        this.Servers[id] = {
            queue: [],
            formattedQueue: [],
            repeatSong: false,
            repeatQueue: false,
            dispatcher: undefined
        };
    },
    addUrlToQueue: function (url, id) {
        this.Servers[id].queue.push(url);
        ytdl.getBasicInfo(url, (err, info) => {
            if (!err) {
                this.Servers[id].formattedQueue.push({
                    title: info.title,
                    duration: secToHHMMSS(parseInt(info.length_seconds)),
                    author: info.author.name
                });
            }
        });
    },
    isBotAlreadyConnected: function (connection) {
        return !Methods.isUndefined(connection) && connection !== null;
    },
    joinVoiceChannelAndStart: function (voiceChannel, msg) {
        voiceChannel.join().then((connection) => {
            play(connection, msg)
        });
    },
    endDispatcher: function (id) {
        if (!Methods.isUndefined(this.Servers[id].dispatcher))
            this.Servers[id].dispatcher.end();
    },
    removeAllSongs: function (id) {
        let queue = this.Servers[id].queue
        for (let x = queue.length - 1; x >= 0; x--)
            queue.splice(x, 1);
    },
    endCurrentAudio: function (id) {
        if (!Methods.isUndefined(this.Servers[id].dispatcher))
            this.Servers[id].dispatcher.end();
    },
    getQueue: function (id) {
        return this.Servers[id].formattedQueue;
    }
};

function play(connection, msg) {
    let server = Music.Servers[msg.guild.id];
    server.dispatcher = connection.playStream(ytdl(server.queue[0], { filter: 'audioonly' }));
    server.dispatcher.on('end', () => {
        if (server.repeatSong || server.repeatQueue) {
            if (server.repeatQueue) {
                server.queue.push(server.queue.shift());
                server.formattedQueue.push(server.formattedQueue.shift());
            }
        } else {
            server.queue.shift();
            server.formattedQueue.shift();
        }
        if (server.queue.length > 0)
            play(connection, msg);
    });
}

function secToHHMMSS(sec) {
    return new Date(1000 * sec).toISOString().substr(11, 8);
}

module.exports = {
    Music: Music
};