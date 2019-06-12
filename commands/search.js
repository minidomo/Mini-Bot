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
};

const alternative = (msg, obj, callback) => {
    const { args } = obj;
    const title = args.join('+');
    axios.get(url + title).then(response => {
        const data = [];
        const $ = cheerio.load(response.data);
        const arr = $('div.yt-lockup-content').toArray();
        for (let x = 0, i = 0; i < opts.maxResults && x < arr.length; x++) {
            const elem = arr[x];
            const obj = {};
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
            if (typeof callback === 'function') {
                obj.args = [data[0].url];
                callback(msg, obj);
                return;
            } else {
                let i = 1;
                res = '';
                for (const { title, author, url } of data)
                    res += `\`${i++}\` *${title}* by ${author}\n\t<${url}>\n\n`;
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

module.exports = {
    name: 'search',
    visible: true,
    useable: true,
    desc: 'Searches for 5 YouTube videos.',
    usage: 'search <video title>',
    pass(msg, { args }) {
        if (args.length === 0) {
            msg.channel.send('You must search for something');
            return false;
        }
        return true;
    },
    run(msg, obj, callback) {
        const { args } = obj;
        const withCallback = typeof callback === 'function';
        opts.maxResults = withCallback ? 1 : 5;
        if (opts.key) {
            let title = args.join(' ');
            search(title, opts, (err, results) => {
                if (err) {
                    msg.logger.error(err);
                    msg.logger.info('Using alternative search.');
                    alternative(msg, obj, callback);
                } else {
                    if (withCallback) {
                        obj.args = [results[0].link]
                        callback(msg, obj);
                    } else {
                        let res = '', i = 1;
                        for (let vid of results)
                            res += `\`${i++}\` *${vid.title}* by ${vid.channelTitle}\n\t<${vid.link}>\n\n`;
                        if (res === '')
                            alternative(msg, obj, callback);
                        else
                            msg.channel.send(res);
                    }
                }
            });
        } else
            alternative(msg, obj, callback);
    }
};