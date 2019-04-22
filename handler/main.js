'use strict';

class MainHandler {
    static log(msg) {
        let out = msg.createdAt + '\nServer: ' + msg.guild.name + ', ' + msg.guild.id +
            '\nUser: ' + msg.author.username + ', ' + msg.author.id + '\n';
        if (msg.content.length > 0)
            out += 'Message: ' + msg.content + '\n';
        let first = true;
        msg.attachments.map((val, key) => {
            if (first) {
                out += 'Attachments:\n';
                first = false;
            }
            out += '\t' + val.url + '\n';
        });
        console.log(out);
    }

    static handleFeature(msg, commands) {
        for (let x in commands) {
            let feature = require('../ext/' + commands[x]);
            if (feature.check(msg)) {
                feature.run(msg);
                return true;
            }
        }
        return false;
    }
}

module.exports = MainHandler;