const pad = (num: number) => ('0' + num).slice(-2);

const hhmmss = (secs: string | number) => {
    let seconds = typeof secs === 'string' ? parseInt(secs) : secs;
    let min = Math.floor(seconds / 60);
    seconds %= 60;
    let hours = Math.floor(min / 60);
    min %= 60;
    return `${pad(hours)}:${pad(min)}:${pad(seconds)}`;
};

export = {
    secToHHMMSS(sec: string | number) {
        return hhmmss(sec);
    },
    limitText(text: string, limit: number) {
        const trimmed = text.trim();
        if (trimmed.length > limit)
            return trimmed.substr(0, limit - 3).trimRight() + '...';
        return trimmed;
    },
    ensureFormatUrl(url: string) {
        let res = url;
        if (res.startsWith('<'))
            res = res.substr(1);
        if (res.endsWith('>'))
            res = res.substr(0, res.length - 1);
        return res;
    }
};