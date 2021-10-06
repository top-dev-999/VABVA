import React from 'react';

import { SiteCompanyPage } from '../../components/site/SiteCompanyPage';
import { getCompanyByUrls } from '../../services/api';

const validateUrls = (urls) => {
    if (urls && Array.isArray(urls) && urls.length >= 2) {
        return urls;
    }

    return undefined;
};

export const getServerSideProps = async (context) => {
    const urls = validateUrls(context.params.urls);

    if (!urls) {
        return {
            notFound: true
        };
    }

    try {
        const result = await getCompanyByUrls(urls);

        return {
            props: result
        };
    } catch (e) {
        return {
            notFound: true
        };
    }
};

const AreaPage = (props) => {
    return <SiteCompanyPage {...props} />;
};

export default AreaPage;
