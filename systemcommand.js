const Methods = require('./methods.js');
const Settings = require('./settings.json');

var AdvancedUserID = Settings['syscmdID'];

let denyUsers = {
    // structure
    // userID: [array of strings of commands they cannot use]
};

const validCommands = ['c4', 'help', 'info', 'play', 'queue', 'randomtard', 'repeat', 'skip', 'stop', 'syscmd'];

const SystemCommand = {
    isAdvancedUser: function (id) {
        return id === AdvancedUserID;
    },
    areValidArgs: function (args) {
        let power = args[0] === 'deny' || args[0] === 'grant';
        let isUser = /<@.+>/.test(args[1]) && args[1].length >= 21;
        let isCommand = validCommands.indexOf(args[2]) >= 0;
        return power && isUser && isCommand;
    },
    execute: function (args) {
        let userID = replaceAll(args[1], /\D+/);
        if (this.isAdvancedUser(userID))
            return false;
        if (Methods.isUndefined(denyUsers[userID])) {
            denyUsers[userID] = [];
        }
        if (args[0] === 'deny') {
            if (denyUsers[userID].indexOf(args[2]) === -1)
                denyUsers[userID].push(args[2]);
        } else {
            let index = denyUsers[userID].indexOf(args[2]);
            if (index >= 0)
                denyUsers[userID].splice(index, 1);
        }
        return true;
    },
    canUseCommand: function (id, cmd) {
        if (Methods.isUndefined(denyUsers[id]))
            return true;
        if (denyUsers[id].indexOf(cmd) >= 0)
            return false;
        return true;
    }
};

function replaceAll(word, regex) {
    while (regex.test(word))
        word = word.replace(regex, '');
    return word;
}

module.exports = {
    SystemCommand: SystemCommand
};