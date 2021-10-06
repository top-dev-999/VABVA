import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import {
    useControlled,
    useMergedRefs,
    useEventCallback,
    defineEventTarget,
    getTouchPosition,
    useIsFocusVisible
} from '../utils';

import { SliderThumbLabel } from './SliderThumbLabel';

const sortAsc = (a, b) => a - b;

const getValidValue = (value = 0, min, max) => {
    return Math.max(Math.min(value, max), min);
};

const valueToPercent = (value = 0, min, max) => {
    return ((value - min) / (max - min)) * 100;
};

const percentToValue = (percent = 100, min, max) => {
    return percent * (max - min) + min;
};

const getRoundValue = (value = 0, step, min) => {
    return Math.round((value - min) / step) * step + min;
};

const getRangeValue = (range = [], value, index) => {
    const result = range;

    result[index] = value;

    return result.sort(sortAsc);
};

const getActiveIndexByValue = (values = [], value) => {
    const result = values.reduce((acc, item, index) => {
        const delta = Math.abs(value - item);

        if (acc === null || delta <= acc.delta) {
            return {
                index,
                delta
            };
        }

        return acc;
    }, null);

    return result ? result.index : null;
};

const focusThumb = (elementRef, activeIndex) => {
    const documentActiveElement = document.activeElement;

    if (
        elementRef.current &&
        (!elementRef.current.contains(document.activeElement) ||
            (documentActiveElement && Number(documentActiveElement.dataset.index) !== activeIndex))
    ) {
        const activeThumb = elementRef.current.querySelector(
            `[role="slider"][data-index="${activeIndex}"]`
        );

        if (activeThumb) {
            activeThumb.focus();
        }
    }
};

const axisStyles = {
    horizontal: {
        offset(percent) {
            return { left: `${percent}%` };
        },
        size(percent) {
            return { width: `${percent}%` };
        }
    },
    vertical: {
        offset(percent) {
            return { bottom: `${percent}%` };
        },
        size(percent) {
            return { height: `${percent}%` };
        }
    }
};

const isValuesRange = (arr) => Array.isArray(arr);

const defaultRenderMarkText = (value) => value;

const defaultIndex = -1;

export const Slider = React.forwardRef(function Slider(props, forwardedRef) {
    const {
        'aria-labelledby': ariaLabelledBy,
        className,
        name,
        value: valueProp,
        defaultValue,
        min = 0,
        max = 100,
        step = 1,
        orientation = 'horizontal',
        disabled,
        openThumbLabel: openThumbLabelProp,
        disableThumbLabel,
        renderThumbLabelText,
        renderMarkText = defaultRenderMarkText,
        disableMarks = true,
        onChange,
        onChangeCommited,
        onFocus,
        onBlur
    } = props;

    const [valueState, setValueState] = useControlled(valueProp, defaultValue);

    let values = isValuesRange(valueState) ? valueState.sort(sortAsc) : [valueState ?? 0];
    values = values.map((value) => getValidValue(value, min, max));

    const [activeIndexState, setActiveIndexState] = useState(defaultIndex);
    const previousActiveIndexRef = useRef(defaultIndex);

    const [openLabelIndexState, setOpenLabelIndexState] = useState(defaultIndex);

    const [focusVisibleIndex, setFocusVisibleIndex] = useState(defaultIndex);
    const { isFocusVisible, onBlurVisible, focusVisibleRef } = useIsFocusVisible();

    const elementRef = useRef(null);
    const handleRef = useMergedRefs(elementRef, focusVisibleRef, forwardedRef);
    const touchIdRef = useRef();

    const getValueByTouchPosition = (position, isMoving = false) => {
        let percent = 0;
        let newValue;
        let activeIndex = 0;

        if (position && elementRef.current) {
            const { width, height, bottom, left } = elementRef.current.getBoundingClientRect();

            if (orientation === 'vertical') {
                percent = (bottom - position.y) / height;
            } else {
                percent = (position.x - left) / width;
            }
        }

        newValue = percentToValue(percent, min, max);
        newValue = getRoundValue(newValue, step, min);
        newValue = getValidValue(newValue, min, max);

        if (isValuesRange(valueState)) {
            if (!isMoving) {
                activeIndex = getActiveIndexByValue(values, newValue);
            } else {
                activeIndex = previousActiveIndexRef.current;
            }

            const prevValue = newValue;

            newValue = getRangeValue(values, newValue, activeIndex ?? defaultIndex);
            activeIndex = newValue.indexOf(prevValue);
            previousActiveIndexRef.current = activeIndex;
        }

        return { newValue, activeIndex };
    };

    // Handlers

    const handleTouchMove = useEventCallback((ev) => {
        const touchPos = getTouchPosition(ev, touchIdRef);
        const { newValue, activeIndex } = getValueByTouchPosition(touchPos, true);

        focusThumb(elementRef, activeIndex);

        setValueState(newValue);
        setActiveIndexState(activeIndex);

        if (onChange) {
            const changeEvent = ev;

            defineEventTarget(changeEvent, { name, value: newValue });
            onChange(changeEvent);
        }
    });

    const handleTouchEnd = useEventCallback((ev) => {
        const touchPos = getTouchPosition(ev, touchIdRef);
        const { newValue } = getValueByTouchPosition(touchPos);

        setActiveIndexState(defaultIndex);

        if (ev.type === 'touchend') {
            setOpenLabelIndexState(defaultIndex);
        }

        touchIdRef.current = undefined;

        if (onChangeCommited) {
            const changeEvent = ev;

            defineEventTarget(changeEvent, { name, value: newValue });
            onChangeCommited(changeEvent);
        }

        document.removeEventListener('mousemove', handleTouchMove);
        document.removeEventListener('mouseup', handleTouchEnd);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    });

    const handleMouseDown = useEventCallback((ev) => {
        ev.preventDefault();

        const touchPos = getTouchPosition(ev);
        const { newValue, activeIndex } = getValueByTouchPosition(touchPos);

        focusThumb(elementRef, activeIndex);

        setValueState(newValue);
        setActiveIndexState(activeIndex);

        if (onChange) {
            defineEventTarget(ev, { name, value: newValue });
            onChange(ev);
        }

        document.addEventListener('mousemove', handleTouchMove);
        document.addEventListener('mouseup', handleTouchEnd);
    });

    const handleFocus = useEventCallback((ev) => {
        if (onFocus) {
            const event = ev;

            defineEventTarget(event, { name, value: valueState });

            onFocus(event);
        }
    });

    const handleBlur = useEventCallback((ev) => {
        if (onBlur) {
            const event = ev;

            defineEventTarget(event, { name, value: valueState });

            onBlur(event);
        }
    });

    const handleTouchStart = useEventCallback((ev) => {
        ev.preventDefault();

        const touchItem = ev.changedTouches[0];

        if (touchItem) {
            touchIdRef.current = touchItem.identifier;
        }

        const touchPos = getTouchPosition(ev, touchIdRef);
        const { newValue, activeIndex } = getValueByTouchPosition(touchPos);

        focusThumb(elementRef, activeIndex);

        setValueState(newValue);
        setActiveIndexState(activeIndex);

        document.addEventListener('touchmove', handleTouchMove);
        document.addEventListener('touchend', handleTouchEnd);
    });

    const handleThumbKeyDown = useEventCallback((ev) => {
        const index = Number(ev.currentTarget.dataset.index);
        const value = values[index];
        let newValue = value;

        switch (ev.key) {
            case 'Home':
                newValue = min;
                break;
            case 'End':
                newValue = max;
                break;
            case 'ArrowUp':
            case 'ArrowRight':
                newValue = value + step;
                break;
            case 'ArrowDown':
            case 'ArrowLeft':
                newValue = value - step;
                break;
            default:
                return;
        }

        ev.preventDefault();

        newValue = getRoundValue(newValue, step, min);
        newValue = getValidValue(newValue, min, max);

        if (isValuesRange(valueState)) {
            const previousValue = newValue;

            newValue = getRangeValue(values, newValue, index);

            const newIndex = newValue.indexOf(previousValue);

            focusThumb(elementRef, newIndex);
            setActiveIndexState(newIndex);
        } else {
            setActiveIndexState(index);
        }

        setValueState(newValue);

        const changeEvent = ev;

        defineEventTarget(changeEvent, { name, value: newValue });

        if (onChange) {
            onChange(changeEvent);
        }

        if (onChangeCommited) {
            onChangeCommited(changeEvent);
        }
    });

    const handleThumbFocus = useEventCallback((ev) => {
        const index = Number(ev.target.dataset.index);

        if (isFocusVisible(ev)) {
            setFocusVisibleIndex(index);
        }
        setOpenLabelIndexState(index);
    });

    const handleThumbBlur = useEventCallback(() => {
        if (focusVisibleIndex !== defaultIndex) {
            onBlurVisible();
            setFocusVisibleIndex(defaultIndex);
        }
        setActiveIndexState(defaultIndex);
        setOpenLabelIndexState(defaultIndex);
    });

    const handleThumbMouseEnter = useEventCallback((ev) => {
        const index = Number(ev.currentTarget.dataset.index);

        setOpenLabelIndexState(index);
    });

    const handleThumbMouseLeave = useEventCallback(() => {
        setOpenLabelIndexState(defaultIndex);
    });

    // Effects

    useEffect(() => {
        const element = elementRef.current;

        if (element) {
            element.addEventListener('touchstart', handleTouchStart, {
                passive: false
            });

            return () => {
                element.removeEventListener('touchstart', handleTouchStart);

                document.removeEventListener('mousemove', handleTouchMove);
                document.removeEventListener('mouseup', handleTouchEnd);
                document.removeEventListener('touchmove', handleTouchMove);
                document.removeEventListener('touchend', handleTouchEnd);
            };
        }

        return undefined;
    }, [handleTouchEnd, handleTouchMove, handleTouchStart]);

    // Render

    const trackOffset = valueToPercent(isValuesRange(valueState) ? values[0] : min, min, max);
    const trackSize = valueToPercent(values[values.length - 1], min, max) - trackOffset;
    const trackStyle = {
        ...axisStyles[orientation].offset(trackOffset),
        ...axisStyles[orientation].size(trackSize)
    };

    return (
        <div
            className={classNames('slider', className, {
                'slider--horizontal': orientation === 'horizontal',
                'slider--vertical': orientation === 'vertical',
                'slider--disabled': disabled
            })}
        >
            <div
                role="presentation"
                className="slider__body"
                ref={handleRef}
                onMouseDown={handleMouseDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
            >
                <input type="hidden" name={name} value={values.join(',')} />
                <div className="slider__rail" />

                <div className="slider__track" style={trackStyle} />

                {values.map((value, index) => {
                    const percent = valueToPercent(value, min, max);
                    const style = axisStyles[orientation].offset(percent);
                    const open =
                        openThumbLabelProp ||
                        openLabelIndexState === index ||
                        activeIndexState === index;

                    return (
                        <SliderThumbLabel
                            key={index}
                            value={value}
                            open={open}
                            disabled={disableThumbLabel || disabled}
                            renderValue={renderThumbLabelText}
                        >
                            <div
                                role="slider"
                                className={classNames('slider__thumb', {
                                    'slider__thumb--active': index === activeIndexState,
                                    'slider__thumb--focus-visible': index === focusVisibleIndex
                                })}
                                style={style}
                                tabIndex={disabled ? -1 : 0}
                                data-index={index}
                                aria-valuemin={min}
                                aria-valuenow={value}
                                aria-valuemax={max}
                                aria-labelledby={ariaLabelledBy}
                                aria-orientation={orientation}
                                onKeyDown={handleThumbKeyDown}
                                onMouseEnter={handleThumbMouseEnter}
                                onMouseLeave={handleThumbMouseLeave}
                                onFocus={handleThumbFocus}
                                onBlur={handleThumbBlur}
                            />
                        </SliderThumbLabel>
                    );
                })}

                {!disableMarks && (
                    <div className="slider__marks">
                        <span>{renderMarkText(min)}</span>
                        <span>{renderMarkText(max)}</span>
                    </div>
                )}
            </div>
        </div>
    );
});
