import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';

import { config } from '../../config';

const getTitle = (title = '') => {
    let baseTitle = '';

    if (config && config?.baseTitle) {
        baseTitle = config?.baseTitle ? String(config?.baseTitle).trim() : null;
    }

    if (baseTitle && title) {
        return [baseTitle, title].join(' - ');
    }

    if (baseTitle) {
        return baseTitle;
    }

    return title;
};

const parseUrl = (url) => {
    return String(url).replace(/\/+/g, '/');
};

const PageHead = (props) => {
    const {
        ignoreBaseTitle = false,
        title: titleProp = '',
        description: descriptionProp = '',
        schema: schemaProp = '',
        canonical: canonicalProp = '',
        children
    } = props;

    const title = !ignoreBaseTitle ? getTitle(String(titleProp).trim()) : String(titleProp).trim();
    const schema = String(schemaProp).trim();
    const description = String(descriptionProp).trim();

    let canonical = String(canonicalProp).trim();
    canonical = parseUrl(canonical);

    const titleElement = title ? <title>{title}</title> : null;

    const descriptionElement = description ? (
        <meta name="description" content={description} />
    ) : null;

    const schemaScript =
        schema.length > 4 ? (
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />
        ) : null;

    const canonicalLink = canonical ? <link rel="canonical" href={canonical} /> : null;

    return (
        <Head>
            {titleElement}
            {descriptionElement}
            {schemaScript}
            {canonicalLink}
            {children}
        </Head>
    );
};

PageHead.propTypes = {
    ignoreBaseTitle: PropTypes.bool,
    title: PropTypes.string,
    description: PropTypes.string,
    schema: PropTypes.string,
    canonical: PropTypes.string,
    children: PropTypes.node
};

export { PageHead };
