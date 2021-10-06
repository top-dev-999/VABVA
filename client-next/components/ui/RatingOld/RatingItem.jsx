import React, { memo, useCallback, useRef, useState } from 'react';
import classNames from 'classnames';

import { useEventCallback } from '../utils';

const isString = (value) => {
    return typeof value === 'string';
};

const RatingItemInner = (props) => {
    const {
        name,
        value = 0,
        checked,
        selected,
        tabIndex = 0,
        size = 'large',
        disabled,
        readOnly,
        onChange,
        onMouseEnter,
        onClick,
        onFocus,
        onBlur
    } = props;

    const [focused, setFocused] = useState(false);
    const inputRef = useRef(null);
    const hiddenFocusRef = useRef(false);

    // Events handlers

    const handleChange = useEventCallback((ev) => {
        if (onChange && !readOnly) {
            onChange(ev);
        }
    });

    const handleMouseEnter = useEventCallback((ev) => {
        if (onMouseEnter && !disabled && !readOnly) {
            onMouseEnter(ev);
        }
    });

    const handleMouseDown = useCallback(
        (ev) => {
            if (!readOnly) {
                ev.preventDefault();

                if (inputRef.current) {
                    hiddenFocusRef.current = true;
                    inputRef.current.focus();
                }
            }
        },
        [readOnly]
    );

    const handleClick = useCallback(
        (ev) => {
            if (!readOnly && onClick) {
                onClick(ev);
            }
        },
        [readOnly, onClick]
    );

    const handleFocus = useCallback(
        (ev) => {
            if (!readOnly) {
                if (!hiddenFocusRef.current) {
                    setFocused(true);
                }

                if (onFocus) {
                    onFocus(ev);
                }
            }
        },
        [readOnly, onFocus]
    );

    const handleBlur = useCallback(
        (ev) => {
            if (!readOnly) {
                hiddenFocusRef.current = false;
                setFocused(false);

                if (onBlur) {
                    onBlur(ev);
                }
            }
        },
        [readOnly, onBlur]
    );

    // Render

    const formatedTabIndex = isString(tabIndex) ? parseInt(tabIndex, 10) : tabIndex;

    return (
        <div
            className={classNames('rating__item', {
                'rating__item--focused': focused,
                'rating__item--disabled': disabled,
                'rating__item--read-only': readOnly,
                [`rating__item--${size}`]: size
            })}
        >
            <div
                className={classNames('rating__icon', {
                    'rating__icon--selected': selected
                })}
            />

            {!readOnly && (
                <input
                    type="radio"
                    name={name}
                    value={value}
                    checked={checked}
                    className="rating__input"
                    disabled={disabled}
                    tabIndex={formatedTabIndex ? -1 : formatedTabIndex}
                    ref={inputRef}
                    onChange={handleChange}
                    onMouseEnter={handleMouseEnter}
                    onMouseDown={handleMouseDown}
                    onClick={handleClick}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                />
            )}
        </div>
    );
};

export const RatingItem = memo(RatingItemInner);
