import React, { useCallback, useMemo, useState } from 'react';
import classNames from 'classnames';

import { composeEventHandlers } from '../utils';
import { BoxLabel } from '../BoxLabel';
import { HelperText } from '../HelperText';
import { FieldLabel } from './FieldLabel';

export const FieldControl = React.forwardRef(function FieldControlWithRef(props, forwardedRef) {
    const {
        component: Component,
        inputComponent: InputComponent,
        variant = 'standard',
        inputRef,
        label,
        labelAlign,
        labelTextAlign,
        labelWidth,
        labelClassName,
        renderLabel,
        className,
        style,
        boxLabel,
        boxLabelAlign,
        helperText,
        filled,
        fullWidth,
        required,
        disabled,
        error,
        errorVariant = 'both',
        touched,
        onFocus,
        onBlur,
        ...other
    } = props;

    const [focused, setFocused] = useState(false);

    // Handlers

    const handleFocus = useCallback(() => {
        setFocused(true);
    }, []);

    const handleBlur = useCallback(() => {
        setFocused(false);
    }, []);

    // Render

    const hasError = !!error && error.length > 0 && !!touched;
    const shouldDisplayInputError = hasError && errorVariant !== 'text';
    const shouldDisplayTextError = hasError && errorVariant !== 'input';

    const inputProps = {
        required,
        disabled,
        onFocus: composeEventHandlers(handleFocus, onFocus),
        onBlur: composeEventHandlers(handleBlur, onBlur),
        ...other,
        ref: inputRef
    };

    let inputElement;

    if (InputComponent) {
        const renderInputProps = {
            fullWidth,
            focused,
            error: shouldDisplayInputError,
            ...inputProps
        };

        inputElement = <InputComponent {...renderInputProps} />;
    } else if (Component) {
        inputElement = <Component {...inputProps} />;
    }

    inputElement = React.isValidElement(inputElement) ? inputElement : undefined;

    const labelElement = useMemo(() => {
        const labelProps = {
            required,
            disabled,
            error: hasError,
            className: labelClassName,
            ...(variant !== 'outlined'
                ? {
                      align: labelAlign,
                      textAlign: labelTextAlign,
                      width: labelWidth
                  }
                : { align: 'top' })
        };

        const labelContent = label || (renderLabel && renderLabel());

        return labelContent ? <FieldLabel {...labelProps}>{labelContent}</FieldLabel> : null;
    }, [
        disabled,
        hasError,
        label,
        labelAlign,
        labelClassName,
        labelTextAlign,
        labelWidth,
        renderLabel,
        required,
        variant
    ]);

    const helperTextElement = useMemo(() => {
        return (
            <HelperText error={shouldDisplayTextError} className="field__helper-text">
                {(shouldDisplayTextError && error) || helperText}
            </HelperText>
        );
    }, [shouldDisplayTextError, error, helperText]);

    const boxLabelElement =
        boxLabel && variant !== 'outlined' ? (
            <BoxLabel label={boxLabel} labelAlign={boxLabelAlign}>
                {inputElement}
            </BoxLabel>
        ) : null;

    const fieldContent =
        variant === 'outlined' ? (
            <div className="field__input">
                <fieldset className="field__fieldset">
                    <legend className="field__fieldset-legend">{labelElement}</legend>
                    {inputElement}
                </fieldset>
                {helperTextElement}
            </div>
        ) : (
            <>
                {labelElement}
                <div className="field__input">
                    {boxLabelElement || inputElement}
                    {helperTextElement}
                </div>
            </>
        );

    return (
        <div
            className={classNames('field', className, {
                'field--filled': filled,
                'field--outlined': variant === 'outlined',
                'field--full-width': fullWidth,
                'field--error': shouldDisplayInputError,
                'field--focused': focused
            })}
            style={style}
            ref={forwardedRef}
        >
            {fieldContent}
        </div>
    );
});
