import React from 'react';
import PropTypes from 'prop-types';

import { CompaniesListItem } from '../CompaniesList/CompaniesListItem';

// This component available only when SSR is applied

const MapsPageSSRAsideCompaniesList = (props) => {
    const { open, data } = props;

    if (!open || data.length === 0) {
        return null;
    }

    return (
        <aside className="maps-page__aside maps-page__aside--right">
            <div className="companies-list">
                <header className="companies-list__header">
                    <h5 className="companies-list__title">Companies</h5>
                </header>
                <div className="companies-list__body">
                    {data.map((item) => (
                        <CompaniesListItem {...item} key={item?.id} ssr />
                    ))}
                </div>
            </div>
        </aside>
    );
};

MapsPageSSRAsideCompaniesList.propTypes = {
    open: PropTypes.bool,
    data: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string
        })
    )
};

export { MapsPageSSRAsideCompaniesList };
