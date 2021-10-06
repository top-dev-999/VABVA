import React from 'react';
import { Form as FormikForm } from 'formik';
import classNames from 'classnames';

export const Form = React.forwardRef(function Form(props, forwardedRef) {
    const { className, centered, maxWidth, style, ...other } = props;

    const componentStyle = {
        ...(maxWidth && { width: '100%', maxWidth }),
        ...style
    };

    return (
        <FormikForm
            className={classNames('form', className, {
                'm-auto': centered
            })}
            style={componentStyle}
            {...other}
            ref={forwardedRef}
        />
    );
});
