import React, { useCallback, useState, useRef } from 'react';
import classNames from 'classnames';

import { defineEventTarget, useControlled, useMergedRefs } from '../utils';
import { RatingItem } from './RatingItem';

export const Rating = React.forwardRef(function Rating(props, forwardedRef) {
    const {
        name,
        value: valueProp,
        defaultValue: defaultValueProp,
        disabled,
        readOnly,
        max = 5,
        size,
        className,
        style,
        tabIndex,
        onChange,
        onFocus,
        onBlur
    } = props;

    const numValueProp = valueProp ? parseInt(valueProp, 10) : undefined;
    const numDefaultValueProp = defaultValueProp ? parseInt(defaultValueProp, 10) : 0;

    const [value, setValue] = useControlled(numValueProp, numDefaultValueProp);
    const [hoveredItemValue, setHoveredItemValue] = useState(0);
    const nodeRef = useRef(null);
    const handleNodeRef = useMergedRefs(nodeRef, forwardedRef);

    // Events handlers

    const handleMouseLeave = useCallback(() => {
        if (!disabled && !readOnly) {
            setHoveredItemValue(0);
        }
    }, [disabled, readOnly]);

    const handleItemChange = useCallback(
        (ev) => {
            ev.persist();

            const targetValue = ev.target.value;

            setValue(() => Number.parseInt(targetValue, 10));

            if (onChange) {
                onChange(ev);
            }
        },
        [setValue, onChange]
    );

    // Reset when click again
    const handleItemClick = useCallback(
        (ev) => {
            ev.persist();

            if (ev.target && Number.parseInt(ev.target?.value, 10) === value) {
                setValue(0);

                defineEventTarget(ev, { name, value: 0 });

                if (onChange) {
                    onChange(ev);
                }
            }
        },
        [setValue, value, name, onChange]
    );

    const handleItemMouseEnter = useCallback((ev) => {
        ev.persist();

        const targetValue = ev.currentTarget.value;

        setHoveredItemValue(() => Number.parseInt(targetValue, 10));
    }, []);

    const handleItemFocus = useCallback(
        (ev) => {
            if (onFocus) {
                onFocus(ev);
            }
        },
        [onFocus]
    );

    const handleItemBlur = useCallback(
        (ev) => {
            if (onBlur) {
                onBlur(ev);
            }
        },
        [onBlur]
    );

    // Render

    const items = [...Array(max)].map((_, index) => {
        const selected = hoveredItemValue > 0 ? index < hoveredItemValue : index < value;
        const itemValue = index + 1;
        const checked = itemValue === value;

        return (
            <RatingItem
                key={index}
                name={name}
                value={itemValue}
                selected={selected}
                checked={checked}
                size={size}
                disabled={disabled}
                readOnly={readOnly}
                tabIndex={tabIndex}
                onChange={handleItemChange}
                onMouseEnter={handleItemMouseEnter}
                onClick={handleItemClick}
                onFocus={handleItemFocus}
                onBlur={handleItemBlur}
            />
        );
    });

    return (
        <div
            className={classNames('rating', className)}
            style={style}
            onMouseLeave={handleMouseLeave}
            ref={handleNodeRef}
        >
            {items}
        </div>
    );
});
