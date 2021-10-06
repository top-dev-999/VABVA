import React from 'react';
import classNames from 'classnames';

export const FormRow = React.forwardRef(function FormRow(props, forwardedRef) {
    const { children, className, ...other } = props;

    return (
        <div className={classNames('form__row', className)} {...other} ref={forwardedRef}>
            {children}
        </div>
    );
});
