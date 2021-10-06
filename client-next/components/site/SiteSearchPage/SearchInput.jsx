import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

import { SelectInput, SelectInputHighlighter } from '../../ui/SelectInput';
import { getLocation } from '../../../services/api/search';
import { config } from '../../../config';

const SearchInputInner = (props) => {
    const { autoFocus } = props;
    const [openMenu, setOpenMenu] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const router = useRouter();
    const inputRef = useRef(null);

    const loadOptions = useCallback(async (query = '') => {
        try {
            return getLocation(query);
        } catch (e) {
            console.error(e);
            return [];
        }
    }, []);

    const getOptionLabel = useCallback((option) => {
        return [option?.name, option?.county].join(', ');
    }, []);

    const getOptionValue = useCallback((option) => option?.id, []);

    const formatOptionLabel = useCallback(
        (option, { context, inputValue: inputValueProp }) => {
            const text = getOptionLabel(option);

            if (context === 'menu') {
                return <SelectInputHighlighter text={text} query={inputValueProp} />;
            }

            return text;
        },
        [getOptionLabel]
    );

    const isOptionSelected = useCallback((option, selected) => {
        return selected.indexOf(option?.id) !== -1;
    }, []);

    const handleChange = useCallback(
        (option) => {
            const { url = '' } = option;

            if (url) {
                router.push(config.urls.price(url), null, {
                    shallow: false
                });
            }
        },
        [router]
    );

    const handleInputChange = useCallback((targetValue, action) => {
        setInputValue(targetValue);

        if (targetValue.length === 0) {
            setOpenMenu(false);
        }
    }, []);

    const handleMenuOpen = useCallback(() => {
        if (inputValue.length > 0) {
            setOpenMenu(true);
        }
    }, [inputValue]);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <React.Fragment>
            <SelectInput
                async
                name="search-input"
                className="search-page__search-input"
                placeholder="Enter location"
                maxMenuHeight={150}
                enableDropdownIndicator
                openMenuOnFocus={false}
                openMenuOnClick={false}
                menuIsOpen={openMenu}
                loadOptions={loadOptions}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                isOptionSelected={isOptionSelected}
                formatOptionLabel={formatOptionLabel}
                ref={inputRef}
                onChange={handleChange}
                onInputChange={handleInputChange}
                onMenuOpen={handleMenuOpen}
            />
        </React.Fragment>
    );
};

SearchInputInner.propTypes = {
    autoFocus: PropTypes.bool
};

export const SearchInput = memo(SearchInputInner);
