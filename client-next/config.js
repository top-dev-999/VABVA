import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const parseUrl = (url = '') => {
    return String(url).replace(/^\/+/, '');
};

const getUrl = (baseUrl = '', extraUrl = '') => {
    if (extraUrl) {
        return `${baseUrl}/${parseUrl(extraUrl)}`;
    }

    return baseUrl;
};

// For routing purpose

const appUrls = {
    home: () => '/',
    maps: (urls = '') => getUrl('/maps', urls),
    news: (id = '') => getUrl('https://vabva.com/news', id),
    areas: (id = '') => getUrl('/areas', id),
    search: (id = '') => '/search',
    price: (urls = '') => getUrl('/skip-hire-price', urls),
    events: (id = '') => getUrl('https://vabva.com/news/tag/events', id),
    blog: (id = '') => getUrl('https://vabva.com/blog', id),
    social: (type = '') => {
        switch (type) {
            case 'instagram':
                return 'https://www.instagram.com/vabvaofficial';
            case 'twitter':
                return 'https://twitter.com/vabvaofficial';
            case 'youtube':
                return 'https://www.youtube.com/channel/UCnRgnnitAfhh0yns29roMiA';
            case 'pinterest':
                return 'https://www.pinterest.co.uk/vabvaofficial';
            default:
                return '#';
        }
    }
};

export const config = Object.freeze({
    baseTitle: '',
    basePath: 'https://vabva.com', // To construct canonical urls (at SSR we can't get access for window object)
    api: {
        baseUrl: 'https://vabva.com/api/'
    },
    googleMap: {
        apiKey: publicRuntimeConfig.googleMapApiKey || '',
        defaultCenter: { lat: 51.501945, lng: -0.118889 },
        defaultZoom: 11 // Smaller than 11 causes an auto-zoom issue
    },
    urls: appUrls
});
