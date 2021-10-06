import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactRating from 'react-rating';

import { useControlled, useMergedRefs, defineEventTarget } from '../utils';
import { RatingItem } from './RatingItem';

const getDecimalPrecision = (precision) => {
    const decimal = String(precision).split('.')[1];

    return decimal ? decimal.length : 0;
};

const roundValueToPreceision = (value = 0, precision = 1) => {
    const nearest = Math.round(value / precision) * precision;

    return Number(nearest.toFixed(getDecimalPrecision(precision)));
};

const Rating = React.forwardRef(function Rating(props, forwardedRef) {
    const {
        name,
        value: valueProp,
        defaultValue: defaultValueProp = 4,
        precision = 0.5,
        tabIndex = 0,
        size,
        readOnly,
        disabled,
        onClick,
        onChange,
        className
    } = props;

    const [value, setValue] = useControlled(valueProp, defaultValueProp);
    const elementRef = useRef(null);
    const handleRef = useMergedRefs(elementRef, forwardedRef);

    const roundedValue = useMemo(() => roundValueToPreceision(value, precision), [
        precision,
        value
    ]);

    const doChange = useCallback(
        (targetValue) => {
            setValue(targetValue);

            if (onChange && elementRef.current) {
                defineEventTarget(elementRef.current, { name, value: targetValue });
                onChange(elementRef.current);
            }
        },
        [name, setValue, onChange]
    );

    const handleClick = useCallback(
        (targetValue) => {
            const shouldReset = targetValue === value;

            doChange(shouldReset ? 0 : targetValue);

            if (onClick) {
                onClick(targetValue);
            }
        },
        [value, onClick, doChange]
    );

    const handleChange = useCallback(
        (targetValue) => {
            doChange(targetValue);
        },
        [doChange]
    );

    const fraction = 1 / precision;

    return (
        <span className={classNames('rating', className)} ref={handleRef}>
            <ReactRating
                initialRating={roundedValue}
                fractions={fraction}
                tabIndex={tabIndex}
                readonly={readOnly}
                onClick={handleClick}
                onChange={handleChange}
                emptySymbol={<RatingItem size={size} readOnly={readOnly} disabled={disabled} />}
                fullSymbol={
                    <RatingItem selected size={size} readOnly={readOnly} disabled={disabled} />
                }
            />
        </span>
    );
});

Rating.propTypes = {
    name: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    defaultValue: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    precision: PropTypes.number,
    tabIndex: PropTypes.number,
    className: PropTypes.string,
    size: PropTypes.string,
    readOnly: PropTypes.bool,
    disabled: PropTypes.bool,
    onChange: PropTypes.func
};

export { Rating };
