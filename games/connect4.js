'use strict';

let servers = {};
const MAXR = 7, MAXC = 7, MAX_PLAYABLE_ROWS = 6, MAXTURNS = 42;
const Piece = { RED: ':red_circle:', BLUE: ':large_blue_circle:', WHITE: ':white_circle:' };
const KeyMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6 };
const Emotes = {
    WIN: [':stuck_out_tongue:', ':joy:', ':stuck_out_tongue_winking_eye:', ':sunglasses:', ':first_place:', ':kissing_heart:'],
    LOSE: [':thinking:', ':disappointed:', ':tired_face:', ':rage:', ':sob:', ':second_place:', ':interrobang:']
};

let Connect4 = function () {
    this.canFF = (msg) => {
        if (getGame(msg))
            return true;
        msg.channel.send('You are not playing a Connect 4 game.');
        return false;
    };

    this.ff = (msg) => {
        let game = getGame(msg);
        let mentions = idToMentions(msg.author.id);
        game.forfeit = Math.max(game.users.indexOf(mentions[0]), game.users.indexOf(mentions[1])) + 1;
        printEmbed(msg, getEmbed(getBoard(game) + lowerDesc(game)));
        removeGame(msg);
    };

    this.canPlace = (msg, col) => {
        let game = getGame(msg);
        if (!game) {
            msg.channel.send('You are not playing a Connect 4 game.');
            return false;
        }
        if (!isTurn(game, msg.author.id)) {
            msg.channel.send('Is it not your turn.');
            return false;
        }
        let letter = col[0].toLowerCase();
        if (!/[abcdefg]/g.test(letter)) {
            msg.channel.send('Invalid position.');
            return false;
        }
        let c = KeyMap[letter];
        for (let r = 0; r < MAX_PLAYABLE_ROWS; r++)
            if (game.board[r][c] == Piece.WHITE)
                return true;
        msg.channel.send('Invalid position.');
        return false;
    };

    this.place = (msg, args) => {
        let game = getGame(msg);
        let c = KeyMap[args[1].toLowerCase()];
        let r = 0;
        while (r < MAXR && game.board[r][c] === Piece.WHITE)
            r++;
        game.board[--r][c] = game.colors[game.turn % 2];
        if (win(game, r, c)) {
            game.winner = game.turn % 2 + 1;
        } else {
            game.turn++;
            if (game.turn === MAXTURNS) {
                game.winner = 3;
            }
        }
        printEmbed(msg, getEmbed(getBoard(game) + lowerDesc(game)));
        if (typeof game.winner !== 'undefined')
            removeGame(msg);
    };

    this.canStart = (msg, user1, user2) => {
        if (!/^<@!?\d+>$/g.test(user1) || !/^<@!?\d+>$/g.test(user2)) {
            msg.channel.send('Both players must be users.');
            return false;
        }
        let u1 = mentionToID(user1);
        let u2 = mentionToID(user2);
        if (msg.guild.members.get(u1).user.bot || msg.guild.members.get(u2).user.bot) {
            msg.channel.send('Bots are not allowed to play.');
            return false;
        }
        let id = msg.guild.id;
        if (!servers[id])
            servers[id] = [];
        let author = msg.author.id;
        if ((author === u1 && author !== u2) || (author !== u1 && author === u2)) {
            let g1 = getGameByMentions(id, user1);
            let g2 = getGameByMentions(id, user2);
            if (g1 || g2) {
                msg.channel.send('At least one of the users is currently in a game.');
                return false;
            }
        } else {
            msg.channel.send('You cannot start a game for other people.');
            return false;
        }
        return true;
    };

    this.start = (msg, args) => {
        let game = {
            users: [],
            colors: [],
            board: [],
            turn: 0
        };
        if (Math.random() < .5)
            game.users.push(args[1], args[2]);
        else
            game.users.push(args[2], args[1]);
        if (Math.random() < .5)
            game.colors.push(Piece.RED, Piece.BLUE);
        else
            game.colors.push(Piece.BLUE, Piece.RED);
        for (let r = 0; r < MAXR; r++) {
            game.board.push([]);
            if (r < 6)
                for (let c = 0; c < MAXC; c++)
                    game.board[r].push(Piece.WHITE);
            else
                'abcdefg'.split('').forEach(c => game.board[r].push(`:regional_indicator_${c}:`));
        }
        servers[msg.guild.id].push(game);
        printEmbed(msg, getEmbed(getBoard(game) + lowerDesc(game)));
    };
};

let removeGame = (msg) => {
    let guild = msg.guild.id;
    for (let x in servers[guild]) {
        let mentions = idToMentions(msg.author.id);
        if (servers[guild][x].users.indexOf(mentions[0]) >= 0 || servers[guild][x].users.indexOf(mentions[1]) >= 0) {
            servers[guild].splice(x, 1);
            return;
        }
    }
};

let win = (game, r, c) => {
    let WE = checkWinCounter(game, r, c, 0, -1) + checkWinCounter(game, r, c, 0, 1);
    if (WE >= 3)
        return true;
    let NS = checkWinCounter(game, r, c, -1, 0) + checkWinCounter(game, r, c, 1, 0);
    if (NS >= 3)
        return true;
    let NWSE = checkWinCounter(game, r, c, -1, -1) + checkWinCounter(game, r, c, 1, 1);
    if (NWSE >= 3)
        return true;
    let SWNE = checkWinCounter(game, r, c, 1, -1) + checkWinCounter(game, r, c, -1, 1);
    if (SWNE >= 3)
        return true;
    return false;
};

let checkWinCounter = (game, r, c, dx, dy) => {
    let count = 0;
    let color = game.board[r][c];
    r += dx;
    c += dy;
    while (r >= 0 && c >= 0 && r < MAX_PLAYABLE_ROWS && c < MAXC && count < 3 && game.board[r][c] === color) {
        r += dx;
        c += dy;
        count++;
    }
    return count;
};

let idToMentions = (id) => {
    return [`<@${id}>`, `<@!${id}>`];
};

let mentionToID = (mention) => {
    let id = mention;
    id = id.replace(/^<@!?/g, '').replace(/>$/g, '');
    return id;
};

let isTurn = (game, id) => {
    let mentions = idToMentions(id);
    let cur = game.users[game.turn % 2]
    return cur === mentions[0] || cur === mentions[1];
};

let getGameByMentions = (guild, mentions) => {
    if (!servers[guild])
        return undefined;
    for (let x in servers[guild])
        if (servers[guild][x].users.indexOf(mentions[0]) >= 0 || servers[guild][x].users.indexOf(mentions[1]) >= 0)
            return servers[guild][x];
    return undefined;
};

let getGame = (msg) => {
    let guild = msg.guild.id;
    if (!servers[guild])
        return undefined;
    for (let x in servers[guild]) {
        let mentions = idToMentions(msg.author.id);
        if (servers[guild][x].users.indexOf(mentions[0]) >= 0 || servers[guild][x].users.indexOf(mentions[1]) >= 0)
            return servers[guild][x];
    }
    return undefined;
};

let getBoard = (game) => {
    let res = '';
    for (let r in game.board) {
        for (let c in game.board[r])
            res += game.board[r][c] + ' ';
        res = res.substr(0, res.length - 1) + '\n';
    }
    return res;
};

let lowerDesc = (game) => {
    let res = '\n';
    if (game.winner) {
        if (game.winner === 3)
            res += `This match has ended as a draw!\n\n${game.users[0]} ${game.colors[0]}
                \n${game.users[1]} ${game.colors[1]}`;
        else
            res += `${game.users[game.winner - 1]} ${game.colors[game.winner - 1]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}
                \n\n${game.users[game.winner % 2]} ${game.colors[game.winner % 2]} loses! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
    } else if (game.forfeit) {
        res += `${game.users[game.forfeit - 1]} ${game.colors[game.forfeit - 1]} surrenders! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}
            \n\n${game.users[game.forfeit % 2]} ${game.colors[game.forfeit % 2]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}`;
    } else
        res += `${game.users[0]} ${game.colors[0]} vs ${game.users[1]} ${game.colors[1]}
            \n\n${game.users[game.turn % 2]}'s Move`;
    return res;
};

let getEmbed = (desc) => {
    let embed = new (require('discord.js')).RichEmbed({ description: desc, title: 'Connect 4' });
    embed.setColor('AQUA');
    return embed;
};

let printEmbed = (msg, embed) => {
    msg.channel.send(embed);
};

module.exports = new Connect4;