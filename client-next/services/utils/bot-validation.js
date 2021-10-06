const regExp = new RegExp(
    '[a-z0-9\\-_]*(bot|crawl|archiver|transcoder|spider|uptime|validator|fetcher|cron|checker|reader|extractor|monitoring|analyzer|scraper)',
    'i'
);

export const isBotValidation = (userAgent = '') => {
    const matches = regExp.exec(String(userAgent).trim());

    return matches && matches.length > 0;
};
