import React from 'react';
import classNames from 'classnames';

export const Heading = React.forwardRef(function Heading(props, forwardedRef) {
    const { size = 5, children, className, gutterBottom = true, upperCase, ...other } = props;

    return React.createElement(
        `h${size}`,
        {
            className: classNames(
                'heading',
                `heading--size-${size}`,
                {
                    'heading--no-gutter-bottom': !gutterBottom,
                    'heading--uppercase': upperCase
                },
                className
            ),
            ref: forwardedRef,
            ...other
        },
        children
    );
});
