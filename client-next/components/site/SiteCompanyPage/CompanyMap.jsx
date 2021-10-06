import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { GoogleMap, BrandMapPin } from '../../GoogleMap';

const CompanyMapInner = (props) => {
    return (
        <section className="section company__map">
            <header className="section__header">
                <h4 className="section__title">Our Location</h4>
            </header>
            <GoogleMap defaultZoom={16} defaultCenter={props}>
                <BrandMapPin {...props} />
            </GoogleMap>
        </section>
    );
};

CompanyMapInner.propTypes = {
    lat: PropTypes.number,
    lng: PropTypes.number
};

export const CompanyMap = memo(CompanyMapInner);
