import React from 'react';
import PropTypes from 'prop-types';
import { BrandMapPin, GoogleMap } from '../../GoogleMap';

const PricePageMap = (props) => {
    const { coordinates, name, postcode } = props;

    const hasCoordinates = Array.isArray(coordinates) && coordinates.length === 2;

    if (!hasCoordinates) {
        return null;
    }

    return (
        <>
            <p className="paragraph text-cursive">
                We&apos;ve placed a map of {name} {postcode}, on the bottom. The exact coordinates
                are latitude {coordinates[0]} and the longitude is {coordinates[1]}.
            </p>
            <GoogleMap
                defaultZoom={13}
                center={coordinates}
                yesIWantToUseGoogleMapApiInternals
                className="price-page__map"
            >
                <BrandMapPin lat={coordinates[0]} lng={coordinates[1]} />
            </GoogleMap>
        </>
    );
};

PricePageMap.propTypes = {
    coordinates: PropTypes.arrayOf(PropTypes.number),
    name: PropTypes.string,
    postcode: PropTypes.string
};

export { PricePageMap };
