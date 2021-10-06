import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const CompaniesMapBalloonInner = React.forwardRef(function CompaniesMapBalloonButtonInner(
    props,
    forwardedRef
) {
    const { color1, color2, selected, ...other } = props;

    return (
        <svg
            className={classNames('map__balloon', {
                'map__balloon--selected': selected
            })}
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...other}
            ref={forwardedRef}
        >
            <path
                d="M15.1924 11.5771C20.0567 6.71283 27.9433 6.71283 32.8076 11.5771C37.6719 16.4415 37.6719 24.3281 32.8076 29.1924L24 38L15.1924 29.1924C10.3281 24.3281 10.3281 16.4415 15.1924 11.5771Z"
                fill="#fff"
            />
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29.2446 35.1203C29.09 35.4986 25.8276 42.8123 25.8276 42.8123C25.1238 44.3959 22.8762 44.3959 22.1724 42.8123C22.1724 42.8123 18.9025 35.4677 18.7658 35.1239C12.4001 32.9241 8 26.896 8 20C8 11.1634 15.1634 4 24 4C32.8366 4 40 11.1634 40 20C40 26.8922 35.6047 32.9176 29.2446 35.1203ZM25.9581 32.6699C26.2001 32.1254 26.6723 31.7171 27.2461 31.5563C32.3819 30.1172 36 25.4146 36 20C36 13.3726 30.6274 8 24 8C17.3726 8 12 13.3726 12 20C12 25.4146 15.6181 30.1172 20.7539 31.5563C21.3277 31.7171 21.7999 32.1254 22.0419 32.6699L24 37.1052L25.9581 32.6699Z"
                fill={color1}
            />
            <circle cx="24" cy="20" r="7" fill={color2 || color1} />
        </svg>
    );
});

CompaniesMapBalloonInner.propTypes = {
    selected: PropTypes.bool,
    color1: PropTypes.string,
    color2: PropTypes.string
};

export const CompaniesMapBalloon = memo(CompaniesMapBalloonInner);
