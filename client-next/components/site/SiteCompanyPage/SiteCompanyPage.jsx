import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Button } from '../../ui/Button';
import { PageLayout } from '../../layouts';
import { PageHead } from '../../PageHead';

import { CompanyTags } from './CompanyTags';
import { CompanyMap } from './CompanyMap';
import { CompanyInfo } from './CompanyInfo';

import { config } from '../../../config';

const CompanyReviews = dynamic(
    () => {
        return import('./CompanyReviews').then((module) => module.CompanyReviews);
    },
    {
        ssr: false
    }
);

const CompanyAbout = dynamic(
    () => {
        return import('./CompanyAbout').then((module) => module.CompanyAbout);
    },
    { ssr: false }
);

const SiteCompanyPage = (props) => {
    const { id, seo, tags, geo, ...other } = props;

    return (
        <PageLayout>
            <PageHead
                title={seo?.title}
                description={seo?.description}
                canonical={seo?.canonical}
                schema={seo?.schema}
            />

            <div className="company-page">
                <div className="company-page__region company-page__region--aside">
                    <section className="company">
                        <CompanyInfo {...other} />

                        <CompanyTags items={tags} />

                        <div className="company__actions">
                            <Link href={config.urls.maps()} passHref>
                                <Button link variant="outline-secondary" size="lg">
                                    Find companies
                                </Button>
                            </Link>
                            <Link href={config.urls.news('tag/guides')} passHref>
                                <Button link variant="secondary" size="lg">
                                    Waste Guides
                                </Button>
                            </Link>
                        </div>

                        <CompanyMap {...geo} />
                    </section>
                </div>
                <div className="company-page__region company-page__region--center">
                    <CompanyAbout {...other} />

                    <CompanyReviews
                        companyId={id}
                        companyName={props?.name}
                        totalReviews={props?.totalReviews}
                    />
                </div>
            </div>
        </PageLayout>
    );
};

SiteCompanyPage.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    tags: PropTypes.array,
    seo: PropTypes.shape({
        title: PropTypes.string,
        description: PropTypes.string,
        canonical: PropTypes.string,
        schema: PropTypes.string
    }),
    geo: PropTypes.object,
    totalReviews: PropTypes.number
};

export { SiteCompanyPage };
