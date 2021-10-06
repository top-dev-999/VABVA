import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

const CompaniesMapClusterInner = (props) => {
    const { pointCount, pointsLength, id, longitude, latitude, onClick, ...other } = props;

    // To avoid unnecessary re-render
    const handleClick = useCallback(
        (ev) => {
            if (onClick) {
                onClick(ev, { id, longitude, latitude });
            }
        },
        [id, latitude, longitude, onClick]
    );

    // Render

    if (!pointCount || !pointsLength) {
        return null;
    }

    const width = `${50 + (pointCount / pointsLength) * 30}`;
    const height = `${50 + (pointCount / pointsLength) * 30}`;
    const fontSize = 15 + pointCount / pointsLength;

    let color = '#F04B4B';

    if (pointCount < 10) {
        color = '#42C123';
    } else if (pointCount < 100) {
        color = '#F19139';
    }

    return (
        <svg
            {...other}
            width={width}
            height={height}
            viewBox="0 0 48 48"
            className="map__cluster"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleClick}
        >
            <g clipPath="url(#clip0)">
                <circle opacity="0.3" cx="24" cy="24" r="19" fill={color} />
                <circle
                    opacity="0.4"
                    cx="24"
                    cy="24"
                    r="21"
                    className="map__cluster-stroke"
                    stroke={color}
                />
                <circle cx="24" cy="24" r="16" fill={color} className="map__cluster-circle" />
            </g>
            <defs>
                <clipPath id="clip0">
                    <rect width="48" height="48" fill="#fff" />
                </clipPath>
            </defs>
            <text
                x="50%"
                y="52%"
                className="map__cluster-text"
                fill="#fff"
                color="#fff"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize={`${fontSize}px`}
            >
                {pointCount}
            </text>
        </svg>
    );
};

CompaniesMapClusterInner.propTypes = {
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number,
    longitude: PropTypes.number,
    pointCount: PropTypes.number,
    pointsLength: PropTypes.number,
    onClick: PropTypes.func
};

export const CompaniesMapCluster = memo(CompaniesMapClusterInner);
