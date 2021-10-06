import React from 'react';

import { CircularProgress } from '../CircularProgress';

const SelectInputLoadingIndicator = (props) => {
    const { cx, innerProps, className } = props;

    return (
        <div
            className={cx(
                {
                    indicator: true,
                    'loading-indicator': true
                },
                className
            )}
            {...innerProps}
        >
            <CircularProgress size="small" className={cx({ 'loading-indicator-spinner': true })} />
        </div>
    );
};

export { SelectInputLoadingIndicator };
