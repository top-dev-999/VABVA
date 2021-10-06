import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import GoogleMapReact from 'google-map-react';

import { config } from '../../config';

const GoogleMap = (props) => {
    const {
        children,
        className,
        defaultCenter,
        defaultZoom,
        yesIWantToUseGoogleMapApiInternals = false,
        onMapLoaded,
        ...other
    } = props;

    const handleGoogleApiLoaded = useCallback(
        ({ map, maps }) => {
            if (onMapLoaded) {
                onMapLoaded(map, maps);
            }
        },
        [onMapLoaded]
    );

    return (
        <div className={classNames('map', className)}>
            <GoogleMapReact
                {...other}
                bootstrapURLKeys={{ key: config.googleMap.apiKey || '' }}
                defaultCenter={defaultCenter || config.googleMap.defaultCenter || null}
                defaultZoom={defaultZoom || config.googleMap.defaultZoom}
                yesIWantToUseGoogleMapApiInternals={
                    !!onMapLoaded || yesIWantToUseGoogleMapApiInternals
                }
                onGoogleApiLoaded={handleGoogleApiLoaded}
            >
                {children}
            </GoogleMapReact>
        </div>
    );
};

GoogleMap.propTypes = {
    children: PropTypes.node,
    defaultCenter: PropTypes.oneOfType([
        PropTypes.shape({
            lat: PropTypes.number,
            lng: PropTypes.number
        }),
        PropTypes.arrayOf(PropTypes.number)
    ]),
    defaultZoom: PropTypes.number,
    yesIWantToUseGoogleMapApiInternals: PropTypes.bool,
    className: PropTypes.string,
    onMapLoaded: PropTypes.func
};

export { GoogleMap };
