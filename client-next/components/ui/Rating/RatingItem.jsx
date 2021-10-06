import React, { memo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const RatingItemInner = (props) => {
    const { selected, size = 'large', readOnly, disabled } = props;

    return (
        <div
            className={classNames('rating__item', {
                [`rating__item--${size}`]: size,
                'rating__item--read-only': readOnly,
                'rating__item--disabled': disabled
            })}
        >
            <div
                className={classNames('rating__icon', {
                    'rating__icon--selected': selected
                })}
            />
        </div>
    );
};

RatingItemInner.propTypes = {
    selected: PropTypes.bool,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    size: PropTypes.oneOf(['small', 'medium', 'large', null])
};

export const RatingItem = memo(RatingItemInner);
