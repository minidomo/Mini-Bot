'use strict';

const Discord = require('discord.js');
const UserUtil = require('../util/user');
const Piece = { ROCK: ':fist:', PAPER: ':raised_back_of_hand:', SCISSORS: ':v:' };
const Emotes = {
    WIN: [':stuck_out_tongue:', ':joy:', ':stuck_out_tongue_winking_eye:', ':sunglasses:', ':first_place:', ':kissing_heart:'],
    LOSE: [':thinking:', ':disappointed:', ':tired_face:', ':rage:', ':sob:', ':second_place:', ':interrobang:']
};

class RockPaperScissors {
    static canPlay(msg, [mention1, mention2]) {
        if (!UserUtil.mentionIsAUser(mention1) || !UserUtil.mentionIsAUser(mention2)) {
            msg.channel.send('Both players must be users.');
            return false;
        }
        let id1 = UserUtil.mentionToID(mention1);
        let id2 = UserUtil.mentionToID(mention2);
        if (UserUtil.isBot(msg.guild.members, id1) || UserUtil.isBot(msg.guild.members, id2)) {
            msg.channel.send('Bots are not allowed to play.');
            return false;
        }
        let authorID = msg.author.id;
        if (authorID === id1 && authorID === id2) {
            msg.channel.send('You cannot play against yourself.');
            return false;
        } else if (authorID !== id1 && authorID !== id2) {
            msg.channel.send('You cannot play a game for other people.');
            return false;
        } else {
            return true;
        }
    }

    static play(msg, args) {
        let p1 = chooseRandom();
        let p2 = chooseRandom();
        let winner = decideMatch(p1, p2);
        let desc = `${args[0]} ${p1} vs ${p2} ${args[1]}\n`;
        if (winner === -1) {
            desc += `It's a draw! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
        } else {
            desc += `${args[winner]} wins! ${Emotes.WIN[Math.floor(Math.random() * Emotes.WIN.length)]}\n`;
            desc += `${args[winner + 1 & 1]} loses! ${Emotes.LOSE[Math.floor(Math.random() * Emotes.LOSE.length)]}`;
        }
        let embed = new Discord.RichEmbed({ description: desc, title: 'RNG Rock Paper Scissors' })
        embed.setColor('LUMINOUS_VIVID_PINK');
        msg.channel.send(embed);
    }
}

let chooseRandom = () => {
    let val = Math.floor(Math.random() * 3);
    return val === 0 ? Piece.ROCK : (val === 1 ? Piece.PAPER : Piece.SCISSORS);
};
let decideMatch = (p1, p2) => {
    if (p1 === Piece.ROCK) {
        switch (p2) {
            case Piece.PAPER: return 1;
            case Piece.SCISSORS: return 0;
        }
    } else if (p1 === Piece.PAPER) {
        switch (p2) {
            case Piece.ROCK: return 0;
            case Piece.SCISSORS: return 1;
        }
    } else {
        switch (p2) {
            case Piece.ROCK: return 1;
            case Piece.PAPER: return 0;
        }
    }
    return -1; // draw
};

module.exports = RockPaperScissors;