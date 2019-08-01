declare module 'youtube-playlist' {
    
    function ytlist(url: string, opts: 'id' | 'url' | 'name' | 'duration' | string[]): Promise<{ data: { playlist: object[] | string[] | number[] } }>

    export default ytlist;
}