'use strict';

const search = require('youtube-search');
const config = require('../config');
const opts = {
    maxResults: 5,
    type: 'video',
    safeSearch: 'none',
    key: config.api_keys.youtube
}

class Search {
    static pass(msg, args) {
        if (args.length === 0) {
            msg.channel.send('You must search for something');
            return false;
        }
        return true;
    }

    static run(msg, args, callback = undefined) {
        let withCallback = typeof callback === 'function';
        opts.maxResults = withCallback ? 1 : 5;
        if (opts.key) {
            let title = args.join(' ');
            search(title, opts, (err, results) => {
                if (err) {
                    msg.channel.send('An error has occured.');
                } else {
                    if (withCallback)
                        callback(msg, [results[0].link]);
                    else {
                        let res = '', i = 1;
                        for (let vid of results)
                            res += `\`${i++}\` *${vid.title}* by ${vid.channelTitle}\n\t<${vid.link}>\n\n`;
                        if (res === '')
                            msg.channel.send('No videos were found. ;-;')
                        else
                            msg.channel.send(res);
                    }
                }
            });
        } else
            msg.channel.send('Using search or searching by a video title requires a Youtube v3 API key.');
    }
}

module.exports = Search;