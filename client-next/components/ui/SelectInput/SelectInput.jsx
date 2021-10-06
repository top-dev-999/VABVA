import React, { useEffect, useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Select, { createFilter } from 'react-select';
import AsyncSelect from 'react-select/async';

import { SelectInputDropdownIndicator } from './SelectInputDropdownIndicator';
import { SelectInputLoadingIndicator } from './SelectInputLoadingIndicator';
import { SelectInputMenuList } from './SelectInputMenuList';

const SelectInput = React.forwardRef(function SelectInput(props, forwardedRef) {
    const {
        name,
        instanceId: instanceIdProp,
        async = true,
        className,
        enableDropdownIndicator = false,
        enableLoadingIndicator = false,
        filterMatchFrom = 'start',
        ...other
    } = props;

    let Component = Select;

    if (async) {
        Component = AsyncSelect;
    }

    const instanceId = instanceIdProp || name;

    const components = useMemo(
        () => ({
            IndicatorSeparator: null,
            DropdownIndicator: enableDropdownIndicator ? SelectInputDropdownIndicator : null,
            LoadingIndicator: enableLoadingIndicator ? SelectInputLoadingIndicator : null,
            MenuList: SelectInputMenuList
        }),
        [enableDropdownIndicator, enableLoadingIndicator]
    );

    const filterOptions = useMemo(() => createFilter({ matchFrom: filterMatchFrom }), [
        filterMatchFrom
    ]);

    return (
        <Component
            {...(async && { cacheOptions: true, defaultOptions: true })}
            isClearable={false}
            {...other}
            instanceId={instanceId}
            name={name}
            className={classNames('select-input', className)}
            classNamePrefix="select-input"
            menuPlacement="auto"
            filterOption={filterOptions}
            components={components}
            captureMenuScroll={false}
            ref={forwardedRef}
        />
    );
});

SelectInput.propTypes = {
    name: PropTypes.string,
    instanceId: PropTypes.string,
    async: PropTypes.bool,
    className: PropTypes.string,
    enableDropdownIndicator: PropTypes.bool,
    filterMatchFrom: PropTypes.oneOf(['start', 'any'])
};

export { SelectInput };
