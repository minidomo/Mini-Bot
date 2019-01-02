const fs = require('fs');

var ID;
fs.readFile('CIGATC_blocked.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        ID = '0';
    } else
        ID = data;
});

const canIGetA_InTheChat = {
    canIGetARegex: /can\s+i\s+get\s+a\s+/,
    canIGetAnRegex: /can\s+i\s+get\s+an\s+/,
    checkFormat: function (content) {
        return /can\s+i\s+get\s+a|(an)\s+.+\s+in\s+the\s+chat/.test(content.toLowerCase());
    },
    isARegex: function (content) {
        return content.search(this.canIGetARegex) >= 0;
    },
    isAnRegex: function (content) {
        return content.search(this.canIGetAnRegex) >= 0;
    },
    getIndexOfRegex: function (content, regex) {
        return content.search(regex);
    },
    checkIfSomchu: function (id) {
        return id === ID;
    },
    handleChant: function (channel, id, chant) {
        if (this.checkIfSomchu(id)) {
            if (chant === 'Shut the fuck up you idiot.')
                channel.send('Stop typing you fucking retard.');
            else
                channel.send('Shut the fuck up you idiot.');
        } else {
            if (chant.length <= 100)
                channel.send(chant);
        }
    }
};

module.exports = {
    getArguments: function (msg) {
        let arr = msg.split(/\s+/);
        if (arr.length == 1)
            return { command: arr[0].substring(2), args: undefined };
        if (arr.length > 1)
            return { command: arr[0].substring(2), args: arr.slice(1, arr.length) };
        return undefined;
    },
    isUndefined: function (obj) {
        return typeof obj === 'undefined';
    },
    inTheChatFeature: canIGetA_InTheChat
};