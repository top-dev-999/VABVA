import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import _truncate from 'lodash/truncate';

import { Rating } from '../../../ui';
import { config } from '../../../../config';

const CompaniesListItem = (props) => {
    const {
        id,
        name: nameProp = '',
        address: addressProp = '',
        rating,
        totalReviews,
        pathnameQuery,
        selected,
        ssr,
        style,
        onClick
    } = props;

    const handleClick = useCallback(
        (ev) => {
            if (onClick) {
                onClick(ev);
            }
        },
        [onClick]
    );

    const name = _truncate(nameProp, { length: 60 });
    const address = _truncate(addressProp, { length: 60 });

    const Component = ssr ? 'a' : 'div';

    const componentProps = {
        ...(!ssr ? { role: 'presentation' } : { href: config.urls.areas(pathnameQuery) })
    };

    return (
        <Component
            {...componentProps}
            className={classNames('company companies-list__item', {
                'companies-list__item--link': ssr,
                'companies-list__item--selected': selected
            })}
            style={style}
            onClick={handleClick}
        >
            <h5 className="company__name">{name}</h5>
            <div className="company__stat">
                {ssr ? (
                    <span>Rating: {rating}</span>
                ) : (
                    <Rating readOnly defaultValue={rating} size="small" />
                )}

                <span className="company__total-reviews">({rating})</span>
            </div>
            <div className="company__address">{address}</div>
        </Component>
    );
};

CompaniesListItem.propTypes = {
    id: PropTypes.string,
    name: PropTypes.string,
    address: PropTypes.string,
    rating: PropTypes.number,
    totalReviews: PropTypes.number,
    pathnameQuery: PropTypes.string,
    ssr: PropTypes.bool,
    selected: PropTypes.bool,
    style: PropTypes.object,
    onClick: PropTypes.func
};

export { CompaniesListItem };
