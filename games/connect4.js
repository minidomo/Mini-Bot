'use strict';

const servers = require('../config').servers.connect4;
const MAXR = 7, MAXC = 7, MAX_PLAYABLE_ROWS = 6, MAXTURNS = 42;
const Piece = { RED: ':red_circle:', BLUE: ':large_blue_circle:', WHITE: ':white_circle:' };
const KeyMap = { a: 0, b: 1, c: 2, d: 3, e: 4, f: 5, g: 6 };
const Emotes = {
    WIN: [':stuck_out_tongue:', ':joy:', ':stuck_out_tongue_winking_eye:', ':sunglasses:', ':first_place:', ':kissing_heart:'],
    LOSE: [':thinking:', ':disappointed:', ':tired_face:', ':rage:', ':sob:', ':second_place:', ':interrobang:']
};

// number & 1 === number % 2
class Connect4 {
    static canFF(msg) {
        if (getGame(msg))
            return true;
        msg.channel.send('You are not playing a Connect 4 game.');
        return false;
    }

    static ff(msg) {
        let game = getGame(msg);
        let mentions = idToMentions(msg.author.id);
        game.forfeit = Math.max(game.users.indexOf(mentions[0]), game.users.indexOf(mentions[1]));
        printEmbed(msg, game);
        removeGame(msg);
    }

    static canPlace(msg, col) {
        let game = getGame(msg);
        if (!game) {
            msg.channel.send('You are not playing a Connect 4 game.');
            return false;
        }
        let isTurn = () => {
            let mentions = idToMentions(msg.author.id);
            let cur = game.users[game.turn & 1]
            return cur === mentions[0] || cur === mentions[1];
        };
        if (!isTurn()) {
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
    }

    static place(msg, args) {
        let game = getGame(msg);
        let c = KeyMap[args[1][0].toLowerCase()];
        let r = 0;
        while (r < MAXR && game.board[r][c] === Piece.WHITE)
            r++;
        game.board[--r][c] = game.colors[game.turn & 1];
        if (win(game, r, c)) {
            game.winner = game.turn & 1;
        } else {
            game.turn++;
            if (game.turn === MAXTURNS)
                game.winner = 2;
        }
        printEmbed(msg, game);
        if ('winner' in game)
            removeGame(msg);
    }

    static canStart(msg, user1, user2) {
        if (!/^<@!?\d+>$/g.test(user1) || !/^<@!?\d+>$/g.test(user2)) {
            msg.channel.send('Both players must be users.');
            return false;
        }
        let mentionToID = mention => mention.replace(/^<@!?/g, '').replace(/>$/g, '');
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
            let g1 = getGameByMention(id, user1);
            let g2 = getGameByMention(id, user2);
            if (g1 || g2) {
                msg.channel.send('At least one of the users is currently in a game.');
                return false;
            }
        } else {
            msg.channel.send('You cannot start a game for other people.');
            return false;
        }
        return true;
    }

    static start(msg, args) {
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
            if (r < MAX_PLAYABLE_ROWS)
                for (let c = 0; c < MAXC; c++)
                    game.board[r].push(Piece.WHITE);
            else
                for (let c of 'abcdefg')
                    game.board[r].push(`:regional_indicator_${c}:`);
        }
        servers[msg.guild.id].push(game);
        printEmbed(msg, game);
    }
}

let removeGame = msg => {
    let guild = msg.guild.id, x = 0;
    let mentions = idToMentions(msg.author.id);
    for (let server of servers[guild]) {
        for (let a = 0; a < 2; a++)
            if (server.users[a] === mentions[0] || server.users[a] === mentions[1]) {
                servers[guild].splice(x, 1);
                return;
            }
        x++;
    }
};

let win = (game, r, c) => {
    let count = (dx, dy) => {
        let count = 0;
        let color = game.board[r][c];
        let row = r + dx;
        let col = c + dy;
        while (row >= 0 && col >= 0 && row < MAX_PLAYABLE_ROWS && col < MAXC && count < 3 && game.board[row][col] === color) {
            row += dx;
            col += dy;
            count++;
        }
        return count;
    };
    let dx = [0, 0, -1, 1, -1, 1, 1, -1];
    let dy = [-1, 1, 0, 0, -1, 1, -1, 1];
    for (let x = 0; x < dx.length; x += 2) {
        let c = count(dx[x], dy[x]) + count(dx[x + 1], dy[x + 1]);
        if (c >= 3)
            return true;
    }
    return false;
};

let idToMentions = id => [`<@${id}>`, `<@!${id}>`];

let getGameByMention = (guild, mention) => {
    if (!servers[guild])
        return undefined;
    for (let server of servers[guild])
        if (server.users[0] === mention || server.users[1] === mention)
            return server;
    return undefined;
};

let getGame = msg => {
    let guild = msg.guild.id;
    if (!servers[guild])
        return undefined;
    let mentions = idToMentions(msg.author.id);
    for (let game of servers[guild]) {
        for (let a = 0; a < 2; a++)
            if (game.users[a] === mentions[0] || game.users[a] === mentions[1])
                return game;
    }
    return undefined;
};

let printEmbed = (msg, game) => {
    let getBoard = () => {
        let res = '';
        for (let r of game.board) {
            for (let c of r)
                res += c + ' ';
            res = res.substr(0, res.length - 1) + '\n';
        }
        return res;
    };
    let lowerDesc = () => {
        let res = '\n';
        if (typeof game.winner !== 'undefined') {
            if (game.winner === 2)
                res += `This match has ended as a draw!\n\n${game.users[0]} ${game.colors[0]}
                    \n${game.users[1]} ${game.colors[1]}`;
            else
                res += `${game.users[game.winner]} ${game.colors[game.winner]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}
                    \n\n${game.users[game.winner + 1 & 1]} ${game.colors[game.winner + 1 & 1]} loses! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
        } else if (typeof game.forfeit !== 'undefined') {
            res += `${game.users[game.forfeit]} ${game.colors[game.forfeit]} surrenders! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}
                \n\n${game.users[game.forfeit + 1 & 1]} ${game.colors[game.forfeit + 1 & 1]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}`;
        } else
            res += `${game.users[0]} ${game.colors[0]} vs ${game.users[1]} ${game.colors[1]}
                \n\n${game.users[game.turn & 1]}'s Move`;
        return res;
    };
    let desc = getBoard() + lowerDesc();
    let embed = new (require('discord.js')).RichEmbed({ description: desc, title: 'Connect 4' });
    embed.setColor('AQUA');
    msg.channel.send(embed);
};

module.exports = Connect4;