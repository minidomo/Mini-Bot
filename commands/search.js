'use strict';

const axios = require('axios').default;
const cheerio = require('cheerio');
const url = 'https://www.youtube.com/results?search_query=';
const search = require('youtube-search');
const config = require('../config');
const opts = {
    maxResults: 5,
    type: 'video',
    order: 'viewCount',
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

    static run(msg, args) {
        if (opts.key) {
            let title = args.join(' ');
            search(title, opts, (err, results) => {
                if (err)
                    alternative(msg, args);
                else {
                    let res = '', i = 1;
                    for (let vid of results)
                        res += `\`${i++}\` *${vid.title}* by ${vid.channelTitle}\n\t<${vid.link}>\n\n`;
                    if (res === '')
                        alternative(msg, args);
                    else
                        msg.channel.send(res);
                }
            });
        } else
            alternative(msg, args);
    }
}

let alternative = (msg, args) => {
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
                obj.duration = elem.firstChild.children[1].firstChild.data;
                if (!obj.duration)
                    continue;
                obj.duration = obj.duration.substring(13, obj.duration.length - 1);
                obj.views = elem.firstChild.firstChild.firstChild.attribs['aria-label'];
                if (!obj.views)
                    continue;
                obj.views = obj.views.substr(obj.views.lastIndexOf(' ', obj.views.length - 7) + 1);
                data.push(obj);
                i++;
            } catch (err) {
                // console.log(err);
            }
        }

        let res;
        if (data.length > 0) {
            let i = 1;
            res = '';
            for (let elem of data)
                res += `\`${i++}\` *${elem.title}* by ${elem.author} \`${elem.views} [${elem.duration}]\`\n\t<${elem.url}>\n\n`;
        } else {
            res = 'No videos were found. ;-;';
        }
        msg.channel.send(res);
    }).catch(err => {
        console.log(err);
        msg.channel.send('An error has occured.');
    });
};

module.exports = Search;