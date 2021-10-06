import React from 'react';
import classNames from 'classnames';

export const FieldLabel = React.forwardRef(function FieldLabel(props, forwardedRef) {
    const {
        children,
        align,
        textAlign,
        required,
        disabled,
        focused,
        error,
        className,
        width,
        style
    } = props;

    const labelStyle = {
        ...style,
        ...(!!width && align !== 'top' && { width })
    };

    return (
        <div
            className={classNames('field__label', className, {
                [`field__label--align-${align}`]: align,
                'field__label--required': required,
                'field__label--error': error,
                'field__label--disabled': disabled,
                'field__label--focused': focused,
                [`text-${textAlign}`]: textAlign && align !== 'top'
            })}
            style={labelStyle}
            ref={forwardedRef}
        >
            {children}
        </div>
    );
});
