'use strict';

/**
 * 
 * @param {number} num 
 */
const pad = num => ('0' + num).slice(-2);
/**
 * 
 * @param {string} secs 
 */
const hhmmss = secs => {
    let seconds = parseInt(secs);
    let min = Math.floor(seconds / 60);
    seconds %= 60;
    let hours = Math.floor(min / 60);
    min %= 60;
    return `${pad(hours)}:${pad(min)}:${pad(seconds)}`;
};

module.exports = {
    /**
     * 
     * @param {string} sec 
     */
    secToHHMMSS(sec) {
        return hhmmss(sec);
    },
    /**
     * 
     * @param {string} text 
     * @param {number} limit 
     */
    shortenText(text, limit) {
        if (text.length > limit)
            return text.substr(0, limit) + '...';
        return text;
    }
};