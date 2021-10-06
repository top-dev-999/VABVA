import React from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';

import { Container, PageLayout } from '../../layouts';
import { PageHead } from '../../PageHead';

const SearchInput = dynamic(() => import('./SearchInput').then((module) => module.SearchInput), {
    ssr: false
});

const SiteSearchPage = () => {
    return (
        <PageLayout>
            <PageHead
                title="Skip hire search"
                description="Search the UKs biggest collection of skip hire prices with over 500,000 records. Find the cheapest skip prices in your area and nearby locations."
            />

            <div className="search-page">
                <div className="search-page__form">
                    <header className="search-page__header">
                        <h2 className="search-page__title search-page__title--large">
                            Find available skip hire sizes and prices
                        </h2>
                        <h4 className="search-page__title search-page__title search-page__title--small">
                            The UK&apos;s biggest skip price database
                        </h4>
                    </header>
                    <div className="search-page__form-body">
                        <SearchInput autoFocus />
                    </div>
                </div>
            </div>
        </PageLayout>
    );
};

export { SiteSearchPage };
