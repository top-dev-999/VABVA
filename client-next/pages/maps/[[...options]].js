import React from 'react';

import { SiteMapsPage } from '../../components/site/SiteMapsPage/SiteMapsPage';
import { parseMapsUrlOptions, getMapCompanies } from '../../services/api/maps';
import { crawlerValidation } from '../../services/utils';

export const getServerSideProps = async (context) => {
    try {
        const options = parseMapsUrlOptions(context.params.options);
        const isCrawler = crawlerValidation(context.req.headers['user-agent']);

        let response = {};

        if (isCrawler) {
            response = await getMapCompanies(options);
        }

        return {
            props: {
                isSSR: isCrawler,
                filters: options,
                ...response
            }
        };
    } catch (e) {
        console.error(e);
        return {
            notFound: true
        };
    }
};

const MapsPage = (props) => {
    return <SiteMapsPage {...props} />;
};

export default MapsPage;
