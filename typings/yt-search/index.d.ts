declare module 'yt-search' {

    namespace ytsearch {

        interface MetaData {
            title: string;
            url: string;
            author: {
                name: string,
                id: string;
                url?: string,
                userId: string,
                userName: string,
                userUrl: string,
                channelId: string,
                channelName: string,
                channelUrl: string
            }
        }

        interface Video extends MetaData {
            videoId: string;
            ago: string;
            seconds: number;
            timestamp: string;
            views: number;
            duration: {
                toString(): string;
                seconds: number;
                timestamp: string
            };
        }

        type Playlist = MetaData;
        type Account = MetaData;

        type Options = {
            query: string,
            pageStart: number,
            pageEnd: number
        }

        type Result = {
            videos: Video[],
            playlists: Playlist[],
            accounts: Account[]
        }
    }

    function ytSearch(
        query: string | ytsearch.Options,
        cb: (err: Error | null, result?: ytsearch.Result) => void
    ): void;

    export = ytSearch;
}