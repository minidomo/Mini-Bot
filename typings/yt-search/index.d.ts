declare module 'yt-search' {

    namespace ytsearch {
        type Video = {
            title: string,
            author: {
                name: string
            },
            videoId: string
        }

        type Result = {
            videos: Video[]
        }
    }

    function ytSearch(
        query: string,
        cb: (err: Error, result?: ytsearch.Result) => void
    ): void;

    export = ytSearch;
}