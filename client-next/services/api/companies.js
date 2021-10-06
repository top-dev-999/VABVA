import _get from 'lodash/get';
import parseISODate from 'date-fns/parseISO';
import isValidDate from 'date-fns/isValid';

import { http } from './http';
import { ResponseData } from './response-data';
import { JsonStringify } from '../utils';

/**
 * Company 
 * Response example
 * 
{
    "sucess": true,
    "result": {
        "companyName": "ESB INNOVATION UK LIMITED",
        "companyNumber": "10671339",
        "_id": "5ffb2a76e9a5fb2e19f1d42b",
        "__v": 0,
        "companyActive": true,
        "details": {
            "website": "https://find-and-update.company-information.service.gov.uk/company/04803358",
            "about": "",
            "video": "",
            "tags": []
        },
        "address": {
            "postcode": "EC3R 7QR",
            "address": "Tricor Suite 4th Floor, 50 Mark Lane, London, United Kingdom, EC3R 7QR",
            "locality": "",
            "county": "Greater London",
            "county_full": "",
            "full_url": "greater-london/esb-innovation-uk-limited",
            "county_url": "greater-london"
        },
        "location": {
            "type": "Point",
            "coordinates": [
                -0.080289,
                51.510066
            ]
        },
        "search": {
            "meta": "ESB INNOVATION UK LIMITED Reviews | Read Customer Service Reviews of ESB INNOVATION UK LIMITED",
            "description": "Join the 1 people who’ve already reviewed ESB INNOVATION UK LIMITED. Your experience can help others make better choices.",
            "tags": [
                {
                    "name": "construction installation",
                    "url": "/maps/place/greater+london/@51.510066,-0.080289/services/construction-installation/distance/10-miles/reviews/0"
                }
            ],
            "schema": [
                {
                    "@context": "http://schema.org",
                    "@type": "LocalBusiness",
                    "name": "ESB INNOVATION UK LIMITED",
                    "@id": "https://vabva.com/areas/greater-london/esb-innovation-uk-limited",
                    "aggregateRating": {
                        "@type": "AggregateRating",
                        "reviewCount": 1,
                        "ratingValue": 5,
                        "worstRating": 5,
                        "bestRating": 5
                    },
                    "address": {
                        "@type": "PostalAddress",
                        "addressCountry": "GB",
                        "PostalCode": "EC3R 7QR",
                        "addressLocality": "Greater London",
                        "streetAddress": "Tricor Suite 4th Floor, 50 Mark Lane, London, United Kingdom, EC3R 7QR"
                    },
                    "geo": {
                        "@type": "GeoCoordinates",
                        "latitude": 51.510066,
                        "longitude": -0.080289
                    },
                    "reviews": [
                        {
                            "@type": "Review",
                            "itemReviewed": {
                                "@type": "Thing",
                                "name": "ESB INNOVATION UK LIMITED"
                            },
                            "author": {
                                "@type": "Person",
                                "name": "Alexandr"
                            },
                            "datePublished": "2021-04-18T22:06:26.313Z",
                            "headline": "test comment",
                            "reviewBody": "test comment",
                            "inLanguage": "en",
                            "publisher": {
                                "@type": "Organization",
                                "name": "VABVA",
                                "sameAs": "https://vabva.com"
                            },
                            "reviewRating": {
                                "@type": "Rating",
                                "ratingValue": 5
                            }
                        }
                    ],
                    "image": [
                        {
                            "@type": "ImageObject",
                            "url": "https://vabva.com/default_logo.png"
                        }
                    ],
                    "url": "https://find-and-update.company-information.service.gov.uk/company/04803358"
                }
            ]
        },
        "totalReviews": 1,
        "totalAverageReviews": 5
    },
    "error": null
}
*/

const parseCompanyResult = (result = {}) => {
    const parseTags = (tags = []) => {
        return tags.map((tag = {}) => {
            return {
                name: _get(tag, 'name', ''),
                url: _get(tag, 'url', '')
            };
        });
    };

    const rating = _get(result, 'totalAverageReviews', 0);

    let schema = _get(result, 'search.schema[0]', '');
    schema = JsonStringify(schema);

    return {
        id: _get(result, '_id', ''),
        name: _get(result, 'companyName', ''),
        number: _get(result, 'companyNumber', ''),
        address: _get(result, 'address.address', ''),
        phone: _get(result, 'details.formatted_phone_number', ''),
        website: _get(result, 'details.website', ''),
        about: _get(result, 'details.about', ''),
        video: _get(result, 'details.video', ''),
        tags: parseTags(_get(result, 'search.tags', [])),
        seo: {
            title: _get(result, 'search.meta', ''),
            description: _get(result, 'search.description', ''),
            canonical: _get(result, 'search.schema[0].@id'),
            schema
        },
        geo: {
            lat: _get(result, 'location.coordinates[1]', 0),
            lng: _get(result, 'location.coordinates[0]', 0)
        },
        totalReviews: _get(result, 'totalReviews', 0),
        rating
    };
};

export const getCompanyByUrls = async (urls = []) => {
    const companyUrl = urls.reduce((result, url) => {
        const slash = result ? '/' : '';

        return result + slash + encodeURIComponent(url);
    }, '');

    const response = await http.get('/v1/company', {
        params: {
            company_full_url: companyUrl
        }
    });

    const responseData = new ResponseData(response);

    if (responseData.error) {
        throw new Error(responseData.error);
    }

    return parseCompanyResult(responseData.result);
};

/**
 * Company reviews
 * Response Example
 * 
 {
    "sucess": true,
    "result": [
        {
            "fullName": "Alexandr",
            "company_id": "5ffb2a76e9a5fb2e19f1d42b",
            "email": "podoprigoraisv@gmail.com",
            "review": "test comment",
            "ratingScore": 5,
            "sentEmailConfirmed": true,
            "createdAt": "2021-04-18T22:06:26.313Z",
            "updatedAt": "2021-04-21T15:59:13.571Z",
            "_id": "607cad6296790f8437f556cb",
            "__v": 0
        }
    ],
    "error": null
}
 */

const parseCompanyReviewsResult = (result = []) => {
    return result.map((item = {}) => {
        let date = _get(item, 'createdAt', null);
        date = parseISODate(date);

        return {
            id: _get(item, '_id', ''),
            user: _get(item, 'fullName', ''),
            email: _get(item, 'email', ''),
            rating: _get(item, 'ratingScore', 0),
            date: isValidDate(date) ? date : null,
            content: _get(item, 'review', '')
        };
    });
};

export const getCompanyReviews = async (companyId = '') => {
    if (!companyId) {
        return null;
    }

    const response = await http.get(`/v1/company/${companyId}/review`);
    const responseData = new ResponseData(response);

    if (responseData.error) {
        throw new Error(response.error);
    }

    return parseCompanyReviewsResult(responseData.result);
};

/**
 * Post review
 */

const parsePostCompanyReviewData = (data = {}) => {
    return {
        ratingScore: Number(data?.rating),
        fullName: data?.name,
        email: data?.email,
        review: data?.review
    };
};

export const postCompanyReview = async (companyId, data = {}) => {
    if (!companyId) {
        return undefined;
    }

    const postData = parsePostCompanyReviewData(data);

    const response = await http.post(`/v1/company/${companyId}/review`, postData);
    const responseData = new ResponseData(response);

    if (responseData.error) {
        throw new Error(responseData.error);
    }

    return responseData;
};
