'use strict';

const axios = require('axios').default;
const cheerio = require('cheerio');
const url = 'https://www.youtube.com/results?search_query=';
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
                    msg.logger.error(err);
                    msg.logger.info('Using alternative search.');
                    alternative(msg, args, callback);
                } else {
                    if (withCallback)
                        callback(msg, [results[0].link]);
                    else {
                        let res = '', i = 1;
                        for (let vid of results)
                            res += `\`${i++}\` *${vid.title}* by ${vid.channelTitle}\n\t<${vid.link}>\n\n`;
                        if (res === '')
                            alternative(msg, args, callback);
                        else
                            msg.channel.send(res);
                    }
                }
            });
        } else
            alternative(msg, args, callback);
    }
}

let alternative = (msg, args, callback = undefined) => {
    let title = args.join('+');
    axios.get(url + title).then(response => {
        let data = [];
        const $ = cheerio.load(response.data);
        let arr = $('div.yt-lockup-content').toArray();
        for (let x = 0, i = 0; i < opts.maxResults && x < arr.length; x++) {
            let elem = arr[x];
            let obj = {};
            try {
                obj.url = 'https://www.youtube.com' + elem.firstChild.firstChild.attribs.href;
                if (!obj.url)
                    continue;
                obj.title = elem.firstChild.firstChild.attribs.title;
                if (!obj.title)
                    continue;
                obj.author = elem.children[1].firstChild.firstChild.data;
                if (!obj.author)
                    continue;
                data.push(obj);
                i++;
            } catch (err) {
                msg.logger.error(err);
            }
        }

        let res;
        if (data.length > 0) {
            if (typeof callback === 'function')
                callback(msg, [data[0].url]);
            else {
                let i = 1;
                res = '';
                for (let elem of data)
                    res += `\`${i++}\` *${elem.title}* by ${elem.author}\n\t<${elem.url}>\n\n`;
            }
        } else {
            res = 'No videos were found. ;-;';
        }
        msg.channel.send(res);
    }).catch(err => {
        msg.logger.error(err);
        msg.channel.send('An error has occured. Please check console.');
    });
};

module.exports = Search;