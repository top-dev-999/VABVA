import _get from 'lodash/get';
import _startCase from 'lodash/startCase';
import _kebabCase from 'lodash/kebabCase';

import { http } from './http';
import { ResponseData } from './response-data';

/**
    @Url example: /place/greater+london/@51.51437,-0.09229/services/oil-seed-production!skip-hire/distance/10-miles/reviews/0 
  
    @param options
    [
        'place',
        'greater+london',
        '@51.51437,-0.09229',
        'services',
        'oil-seed-production!skip-hire',
        'distance',
        '10-miles',
        'reviews',
        '0'
    ]
  
    @return:
    {
        "county":"greater london",
        "coordinates":{
            "lat":"51.51437",
            "long":"-0.09229"
        },
        "services":[
            "oil seed production",
            "skip hire"
        ],
        "distance":{
            "value":"10",
            "measurement":"miles"
        },
        "reviews":"0"
    }
 */

export const parseMapsUrlOptions = (options = []) => {
    const parseCounty = (county = '') => {
        return String(county).toLowerCase().replace(/\++/g, ' ');
    };

    const parseCoordinates = (coordinates = '') => {
        const arr = String(coordinates).replace(/\@/, '').split(',');

        return {
            lat: arr[0] ? parseFloat(arr[0]) : 0,
            long: arr[1] ? parseFloat(arr[1]) : 0
        };
    };

    const parseServices = (services = '') => {
        return String(services).split('!');
    };

    const parseDistance = (distance = '') => {
        const arr = String(distance).split('-');

        return {
            value: arr[0] || '10',
            measurement: arr[1] || 'miles'
        };
    };

    const parseReviews = (reviews = '') => {
        return reviews ? Number(reviews) : 0;
    };

    const defaultValue = {
        county: 'greater london',
        coordinates: { lat: 51.51437, long: -0.09229 },
        distance: { value: '10', measurement: 'miles' },
        reviews: 0
    };

    if (!Array.isArray(options)) {
        return defaultValue;
    }

    return options.reduce((acc, item, index) => {
        const result = { ...acc };

        const field = String(item).trim();

        if (field === 'place') {
            result.county = parseCounty(options[index + 1]);
            result.coordinates = parseCoordinates(options[index + 2]);
        } else if (field === 'services') {
            result.services = parseServices(options[index + 1]);
        } else if (field === 'distance') {
            result.distance = parseDistance(options[index + 1]);
        } else if (field === 'reviews') {
            result.reviews = parseReviews(options[index + 1]);
        } else if (field === 'company') {
            result.company = String(options[index + 1]);
        }

        return result;
    }, defaultValue);
};

export const createUrlByValues = (values = {}) => {
    const {
        company: companyProp,
        place,
        services: servicesProp,
        distance: distanceProp,
        reviews: reviewsProp = 0
    } = values;

    const parseCounty = (county = '') => {
        return String(county).toLowerCase().trim().replace(/\s+/g, '+');
    };

    const parseCoordinates = (coordinates = []) => {
        if (coordinates.length !== 2) {
            return null;
        }

        return ['@', coordinates[0], ',', coordinates[1]].join('');
    };

    const parseServices = (services = []) => {
        if (services.length === 0) {
            return null;
        }

        return services.join('!');
    };

    if (!place) {
        return null;
    }

    const county = parseCounty(place?.county);
    const coordinates = parseCoordinates(place?.coordinates);

    if (!county || !coordinates) {
        return null;
    }

    let pathname = `/place/${county}/${coordinates}`;

    if (servicesProp) {
        const services = parseServices(servicesProp);

        if (services) {
            pathname = `${pathname}/services/${services}`;
        }
    }

    if (companyProp) {
        const company = encodeURIComponent(String(companyProp).trim());

        pathname = `${pathname}/company/${company}`;
    }

    if (distanceProp) {
        const distance = Number.parseInt(distanceProp, 10);

        if (!Number.isNaN(distance)) {
            pathname = `${pathname}/distance/${distance}-miles`;
        }
    }

    const reviews = Number.parseFloat(reviewsProp);

    if (reviews >= 0) {
        pathname = `${pathname}/reviews/${reviews}`;
    }

    return pathname;
};

export const parseMapCompany = (result = {}) => {
    const parseColours = (colours = []) => {
        return colours.map((color = {}) => {
            const description = _get(color, 'descriptions', []);

            return {
                colour: _get(color, 'colour', ''),
                companies: _get(color, 'companies', ''),
                description: description.join(' ')
            };
        });
    };

    const rating = _get(result, 'ratingScore', 0);

    let lat = _get(result, 'location.coordinates[1]', 0);
    lat = parseFloat(lat);

    let lng = _get(result, 'location.coordinates[0]', 0);
    lng = parseFloat(lng);

    let pathnameQuery = _get(result, 'address.full_url', '');
    pathnameQuery = String(pathnameQuery).replace(/^\//, '');

    return {
        id: _get(result, '_id', ''),
        name: _get(result, 'companyName', ''),
        number: _get(result, 'companyNumber', ''),
        address: _get(result, 'address.address', ''),
        pathnameQuery,
        phone: _get(result, 'details.formatted_phone_number', ''),
        website: _get(result, 'details.website', ''),
        about: _get(result, 'details.about', ''),
        colours: parseColours(_get(result, 'colours'), []),
        geo: {
            lat,
            lng
        },
        totalReviews: _get(result, 'totalReviews', 0),
        rating
    };
};

const parseMapCompaniesResult = (result = {}) => {
    const towns = _get(result, 'search.nearby.towns');
    const cities = _get(result, 'search.nearby.cities');
    let companies = _get(result, 'companies', []);

    if (companies && companies.length > 0) {
        companies = companies.map(parseMapCompany);
    }

    return {
        companies: companies || [],
        seo: {
            area: _get(result, 'search.area', ''),
            title: _get(result, 'search.meta', ''),
            description: _get(result, 'search.description', ''),
            canonical: _get(result, 'search.canonicalURL', '')
        },
        nearby: {
            towns: towns || [],
            cities: cities || []
        }
    };
};

export const getMapSeo = async (options = {}) => {
    const response = await http.post(`/getmapseo`, options);

    const responseData = new ResponseData(response);

    return parseMapCompaniesResult(responseData.result);
};

export const getMapCompanies = async (options = {}) => {
    const response = await http.post(`/getmapsearch`, options);

    const responseData = new ResponseData(response);

    return parseMapCompaniesResult(responseData.result);
};

const parseMapPlacesResult = (result = []) => {
    return result.map((item) => {
        const name = _get(item, 'name', '');
        const county = _get(item, 'county', '');

        const id = _kebabCase(`${name}-${county}`);

        let coordinates = _get(item, 'location.coordinates', []);
        coordinates = coordinates.slice().reverse();

        let url = _get(item, 'full_url', '');
        url = url.split('/')[0] || url;

        return {
            id,
            name,
            county,
            coordinates,
            url
        };
    });
};

export const getMapPlaces = async (query = '') => {
    const response = await http.get(`/autocomplete`, {
        params: {
            datatype: 'places',
            name: query
        }
    });

    const responseData = new ResponseData(response);

    return parseMapPlacesResult(responseData.result);
};

const parseMapServicesResult = (result = []) => {
    return result.map((item) => {
        const id = String(item).toLowerCase().replace(/\s+/g, '-');
        const name = _startCase(item);

        return {
            id,
            name
        };
    });
};

export const getMapServices = async (query = '') => {
    const response = await http.get(`/autocomplete`, {
        params: {
            datatype: 'map_services',
            name: query
        }
    });

    const responseData = new ResponseData(response);

    return parseMapServicesResult(responseData.result);
};
