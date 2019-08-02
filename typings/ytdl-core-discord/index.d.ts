declare module 'ytdl-core-discord' {
    import { Readable } from 'stream';

    function ytdl(url: string): Readable;

    export = ytdl;
}