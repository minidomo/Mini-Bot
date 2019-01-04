const Discord = require('discord.js');

const Connect4 = {
    inProgress: false,
    currentUsers: [],
    currentColors: [],
    currentTurn: undefined,
    currentPieces: 0,
    letterCount: {
        'a': 1,
        'b': 1,
        'c': 1,
        'd': 1,
        'e': 1,
        'f': 1,
        'g': 1
    },
    letterIndex: {
        'a': 0,
        'b': 1,
        'c': 2,
        'd': 3,
        'e': 4,
        'f': 5,
        'g': 6
    },
    board: {
        'r6': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
        'r5': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
        'r4': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
        'r3': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
        'r2': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
        'r1': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
        'r0': [':regional_indicator_a:', ':regional_indicator_b:', ':regional_indicator_c:', ':regional_indicator_d:', ':regional_indicator_e:', ':regional_indicator_f:', ':regional_indicator_g:']
    },
    checkValidUser: function (user) {
        let regex = new RegExp('<@.+>');
        return regex.test(user) && user.length >= 21;
    },
    checkIfAuthorIsOneOfTheUsers: function (msg, user1, user2) {
        let idOfAuthor = msg.author.id;
        let user1Check = user1.indexOf(idOfAuthor) > -1;
        let user2Check = user2.indexOf(idOfAuthor) > -1;
        return (user1Check || user2Check) && !(user1Check && user2Check); // xor check
    },
    checkIfAbleToStart: function (msg, args) {
        let isStart = args[0] === 'start';
        let user1Valid = this.checkValidUser(args[1]);
        let user2Valid = this.checkValidUser(args[2]);
        let validAuthor = this.checkIfAuthorIsOneOfTheUsers(msg, args[1], args[2]);
        let gameIsEmpty = this.currentUsers.length === 0;
        let isOpen = !this.inProgress;
        return isStart && user1Valid && user2Valid && validAuthor && gameIsEmpty && isOpen;
    },
    startInit: function (msg, args) {
        let reg = new RegExp('\\D+');
        this.currentUsers.push(replaceAll(args[1], reg), replaceAll(args[2], reg));
        this.inProgress = true;
        let first = random(0, 1);
        this.currentTurn = this.currentUsers[first];
        if (random(0, 1) === 0)
            this.currentColors.push('red', 'blue');
        else
            this.currentColors.push('blue', 'red');

        let description = this.printBoard();
        let Embed = new Discord.RichEmbed({ description: description, title: 'Connect 4' });
        Embed.setColor('AQUA');
        msg.channel.send(Embed);
    },
    printBoard: function () {
        let board = '';
        for (let prop in this.board) {
            let arr = this.board[prop + ''];
            for (let x = 0; x < arr.length - 1; x++)
                board += arr[x] + ' ';
            board += arr[arr.length - 1] + '\n';
        }

        if (arguments.length === 1) {
            if (arguments[0] === 'winner') {
                let winnerIndex = this.currentUsers.indexOf(this.currentTurn);
                let loserIndex = Math.abs(winnerIndex - 1);
                board += '\n' + this.formatUserID(this.currentUsers[winnerIndex]) + ' ' + this.formatColor(this.currentColors[winnerIndex]) + ' wins! :free:\n\n' + this.formatUserID(this.currentUsers[loserIndex]) + ' ' + this.formatColor(this.currentColors[loserIndex]) + ' loses! :sob:';
            } else if (arguments[0] === 'draw')
                board += '\nThis match has ended as a draw!\n\n' + this.formatUserID(this.currentUsers[0]) + ' ' + this.formatColor(this.currentColors[0]) + ':rage:\n' + this.formatUserID(this.currentUsers[1]) + ' ' + this.formatColor(this.currentColors[1]) + ':interrobang:';
        } else if (arguments.length === 2) {
            if (arguments[0] === 'ff') {
                let loserIndex = this.currentUsers.indexOf(arguments[1]);
                let winnerIndex = Math.abs(loserIndex - 1);
                board += '\n' + this.formatUserID(this.currentUsers[loserIndex]) + ' ' + this.formatColor(this.currentColors[loserIndex]) + ' surrenders!\n\n' + this.formatUserID(this.currentUsers[winnerIndex]) + ' ' + this.formatColor(this.currentColors[winnerIndex]) + ' wins!';
            }
        } else {
            board += '\n' + this.formatUserID(this.currentUsers[0]) + ' ' + this.formatColor(this.currentColors[0]) + ' vs ' + this.formatUserID(this.currentUsers[1]) + ' ' + this.formatColor(this.currentColors[1]) + '\n\n';
            board += this.formatUserID(this.currentTurn) + '\'s Move';
        }
        return board;
    },
    formatUserID: function (userID) {
        return '<@' + userID + '>';
    },
    formatColor: function (color) {
        return color === 'red' ? ':red_circle:' : ':large_blue_circle:';
    },
    checkIfAbleToPlace: function (msg, args) {
        let authorMatch = this.currentTurn === msg.author.id;
        let isP = args[0] === 'p';
        let validLocation = false;
        if (args[1].length === 1) {
            let letter = args[1];
            let reg1 = new RegExp('[a-g]');
            validLocation = reg1.test(letter) && this.letterCount[letter] <= 6;
        }
        return authorMatch && isP && validLocation;
    },
    placePiece: function (msg, args) {
        let letter = args[1].substring(0, 1).toLowerCase();
        let num = this.letterCount[letter] + '';
        let colorFormat = this.formatColor(this.currentColors[this.currentUsers.indexOf(this.currentTurn)]);
        this.board['r' + num][this.letterIndex[letter]] = colorFormat;
        this.currentPieces++;

        if (this.checkIfWin(letter, num, colorFormat)) {
            let description = this.printBoard('winner');
            let Embed = new Discord.RichEmbed({ description: description, title: 'Connect 4' });
            Embed.setColor('AQUA');
            msg.channel.send(Embed);
            this.reset();
            return;
        } else if (this.currentPieces === 42) {
            let description = this.printBoard('draw');
            let Embed = new Discord.RichEmbed({ description: description, title: 'Connect 4' });
            Embed.setColor('AQUA');
            msg.channel.send(Embed);
            this.reset();
            return;
        }

        this.currentTurn = this.currentUsers[Math.abs(this.currentUsers.indexOf(this.currentTurn) - 1)];
        let description = this.printBoard();
        let Embed = new Discord.RichEmbed({ description: description, title: 'Connect 4' });
        Embed.setColor('AQUA');
        msg.channel.send(Embed);
        this.letterCount[letter] = this.letterCount[letter] + 1; // has to be at the end else checkwin will get error
    },
    checkIfWin: function (letter, num, colorFormat) {
        let top, bot, left, right, topleft, botright, topright, botleft;
        top = bot = left = right = topleft = botright = topright = botleft = 0;

        // top
        for (let x = parseInt(num) + 1, count = 0; this.checkWinError(x, this.letterIndex[letter], count, colorFormat); x++ , count++)
            top++;
        // bot
        for (let x = parseInt(num) - 1, count = 0; this.checkWinError(x, this.letterIndex[letter], count, colorFormat); x-- , count++)
            bot++;
        if (top + bot >= 3)
            return true;

        // left
        for (let x = this.letterIndex[letter] - 1, count = 0; this.checkWinError(num, x, count, colorFormat); x-- , count++)
            left++;
        // right
        for (let x = this.letterIndex[letter] + 1, count = 0; this.checkWinError(num, x, count, colorFormat); x++ , count++)
            right++;
        if (left + right >= 3)
            return true;

        // topleft
        for (let x = this.letterIndex[letter] - 1, y = parseInt(num) + 1, count = 0; this.checkWinError(y, x, count, colorFormat); x-- , y++ , count++)
            topleft++;
        // botright
        for (let x = this.letterIndex[letter] + 1, y = parseInt(num) - 1, count = 0; this.checkWinError(y, x, count, colorFormat); x++ , y-- , count++)
            botright++;
        if (topleft + botright >= 3)
            return true;

        // topright
        for (let x = this.letterIndex[letter] + 1, y = parseInt(num) + 1, count = 0; this.checkWinError(y, x, count, colorFormat); x++ , y++ , count++)
            topright++;
        // botleft 
        for (let x = this.letterIndex[letter] - 1, y = parseInt(num) - 1, count = 0; this.checkWinError(y, x, count, colorFormat); x-- , y-- , count++)
            botleft++;
        if (botleft + topright >= 3)
            return true;

        return false;
    },
    checkWinError: function (num, letterDex, count, colorFormat) {
        let isOnBoard = typeof this.board['r' + num] !== 'undefined' && (letterDex >= 0 && letterDex <= 6);
        if (!isOnBoard)
            return false;
        let below3 = count < 3;
        let rightColor = colorFormat === this.board['r' + num][letterDex];
        return below3 && rightColor;
    },
    reset: function () {
        this.inProgress = false;
        this.currentUsers = [];
        this.currentColors = [];
        this.currentTurn = undefined;
        this.currentPieces = 0;
        this.board = {
            'r6': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
            'r5': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
            'r4': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
            'r3': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
            'r2': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
            'r1': [':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:', ':white_circle:'],
            'r0': [':regional_indicator_a:', ':regional_indicator_b:', ':regional_indicator_c:', ':regional_indicator_d:', ':regional_indicator_e:', ':regional_indicator_f:', ':regional_indicator_g:']
        };
        this.letterCount = {
            'a': 1,
            'b': 1,
            'c': 1,
            'd': 1,
            'e': 1,
            'f': 1,
            'g': 1
        }
    },
    checkIfCanFF: function (msg, args) {
        let isFF = args[0] === 'ff';
        let isAPlayer = this.currentUsers.indexOf(msg.author.id) >= 0;
        return isFF && isAPlayer;
    },
    ff: function (msg, args) {
        let description = this.printBoard('ff', msg.author.id);
        let Embed = new Discord.RichEmbed({ description: description, title: 'Connect 4' });
        Embed.setColor('AQUA');
        msg.channel.send(Embed);
        this.reset();
    },
    help: function (msg) {
        let description = '`ff` Surrender.\n' +
            '`help` Shows sub-commands of `c4`.\n' +
            '`p [coordinate]` Place your piece on the board.\n' +
            '`start [user1] [user2]` Start a game with another player. Only one game can be in progess.';
        let Embed = new Discord.RichEmbed({ description: description, title: 'Connect 4 Sub-commands' });
        Embed.setColor('RED');
        msg.channel.send(Embed);
    }
};

function random(lower, upper) {
    return Math.floor((Math.random() * (upper - lower + 1))) + lower;
}

function replaceAll(word, regex) {
    while (regex.test(word))
        word = word.replace(regex, '');
    return word;
}

module.exports = {
    Connect4: Connect4
};