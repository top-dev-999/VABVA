import React from 'react';

import { SearchSvg } from '../../../assets/svg';

const SelectInputDropdownIndicator = (props) => {
    const { cx, innerProps, className } = props;

    return (
        <div
            className={cx(
                {
                    indicator: true,
                    'dropdown-indicator': true
                },
                className
            )}
            {...innerProps}
        >
            <SearchSvg className={cx({ 'dropdown-indicator-icon': true })} />
        </div>
    );
};

export { SelectInputDropdownIndicator };
