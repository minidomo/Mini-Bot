'use strict';

class Song {
    /**
     * 
     * @param {object} data 
     * @param {string} data.title
     * @param {string} data.author
     * @param {string} data.duration
     * @param {string} data.id
     */
    constructor(data) {
        this.title = data.title;
        this.author = data.author;
        this.duration = data.duration;
        this.id = data.id
    }
    /**
     * 
     * @param {object} data 
     * @param {string} data.title
     * @param {string} data.author
     * @param {string} data.duration
     * @param {string} data.id
     */
    set(data = {}) {
        if (data.title)
            this.title = data.title;
        if (data.author)
            this.author = data.author;
        if (data.duration)
            this.duration = data.duration;
        if (data.id)
            this.id = id;
    }

    getElement() {
        return {
            title: this.title,
            author: this.author,
            duration: this.duration,
            id: this.id
        };
    }
}

module.exports = Song;