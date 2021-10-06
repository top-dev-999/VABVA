import React from 'react';
import classNames from 'classnames';

export const HelperText = (props) => {
    const { children = '', error, className, ...other } = props;

    if (!children || children?.length === 0) {
        return null;
    }

    return (
        <small
            className={classNames('helper-text', className, {
                'helper-text--error': error
            })}
            {...other}
        >
            {children}
        </small>
    );
};
