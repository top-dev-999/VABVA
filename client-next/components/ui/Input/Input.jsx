import React, { useCallback, useRef, forwardRef } from 'react';
import classNames from 'classnames';

import { useControlled, useMergedRefs } from '../utils';
import { InputAdornment } from './InputAdornment';

export const Input = forwardRef(function Input(props, forwardedRef) {
    const {
        type = 'text',
        id,
        name,
        defaultValue,
        value,
        placeholder,
        disabled,
        required,
        focused: focusedProp,
        readOnly,
        autoFocus,
        autoComplete,
        fullWidth,
        tabIndex = '0',
        error,
        className,
        inputComponent = 'input',
        inputProps,
        displayRef,
        prependAdornment,
        appendAdornment,
        onBlur,
        onFocus,
        onChange,
        onClick,
        onKeyDown,
        onKeyUp,
        onMouseDown,
        ...other
    } = props;

    const [focused, setFocused] = useControlled(focusedProp, false);

    const inputRef = useRef(null);
    const handleInputRef = useMergedRefs(inputRef, forwardedRef);

    // Handlers

    const handleFocus = (ev) => {
        if (onFocus) {
            onFocus(ev);
        }

        setFocused(true);
    };

    const handleBlur = (ev) => {
        if (onBlur) {
            onBlur(ev);
        }

        setFocused(false);
    };

    const handleChange = (ev) => {
        if (onChange) {
            onChange(ev);
        }
    };

    const handleClick = useCallback((ev) => {
        if (inputRef.current && ev.target === ev.currentTarget) {
            inputRef.current.focus();
        }
    }, []);

    // Render

    let InputComponent = inputComponent;

    if (type === 'textarea') {
        InputComponent = 'textarea';
    }

    const inputEl = (
        <InputComponent
            type={type}
            ref={handleInputRef}
            className="input__el"
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            {...{
                disabled,
                id,
                name,
                defaultValue,
                value,
                tabIndex,
                placeholder,
                required,
                readOnly,
                autoFocus,
                autoComplete,
                onMouseDown,
                onClick,
                onKeyDown,
                onKeyUp
            }}
            {...inputProps}
        />
    );

    return (
        <div
            role="presentation"
            className={classNames('input', className, {
                'input--disabled': disabled,
                'input--focused': focused || error,
                'input--full-width': fullWidth,
                'input--error': error
            })}
            tabIndex={-1}
            {...other}
            onClick={handleClick}
            ref={displayRef}
        >
            {prependAdornment && <InputAdornment start>{prependAdornment(props)}</InputAdornment>}
            {inputEl}
            {appendAdornment && <InputAdornment end>{appendAdornment(props)}</InputAdornment>}
        </div>
    );
});
