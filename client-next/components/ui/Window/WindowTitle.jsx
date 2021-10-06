import React from 'react';
import classNames from 'classnames';

import { Heading } from '../Heading';

export const WindowTitle = (props) => {
    const { children, size = '5', className, fullWidth, ...other } = props;

    return (
        <Heading
            size={size}
            gutterBottom={false}
            className={classNames('window__header-title', className, {
                'window__header-title--fullwidth': fullWidth
            })}
            {...other}
        >
            {children}
        </Heading>
    );
};
