class Song {
    title: string | undefined;
    author: string | undefined;
    duration: string | undefined;
    id: string | undefined;

    constructor(data: { title?: string, author?: string, duration?: string, id?: string } = {}) {
        this.title = data.title;
        this.author = data.author;
        this.duration = data.duration;
        this.id = data.id
    }

    set(data: { title?: string, author?: string, duration?: string, id?: string } = {}) {
        if (data.title)
            this.title = data.title;
        if (data.author)
            this.author = data.author;
        if (data.duration)
            this.duration = data.duration;
        if (data.id)
            this.id = data.id;
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

export default Song;