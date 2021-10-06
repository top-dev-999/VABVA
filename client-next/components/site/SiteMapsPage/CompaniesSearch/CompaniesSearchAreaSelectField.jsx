import React, { memo, useCallback } from 'react';
import PropTypes from 'prop-types';

import { SelectField } from '../../../ui/FormikForm';
import { SelectInputHighlighter } from '../../../ui/SelectInput';
import { getMapPlaces } from '../../../../services/api/maps';

const CompaniesSearchAreaSelectFieldInner = (props) => {
    const { onNearbyClick } = props;

    const fetchPlaceOptions = useCallback(async (query = '') => {
        try {
            return getMapPlaces(query);
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
        (option, { context, inputValue }) => {
            const text = getOptionLabel(option);

            if (context === 'menu') {
                return <SelectInputHighlighter text={text} query={inputValue} />;
            }

            return text;
        },
        [getOptionLabel]
    );

    const isOptionSelected = useCallback((option, selected) => {
        return selected.indexOf(option?.id) !== -1;
    }, []);

    const handleNerbyClick = useCallback(
        (ev) => {
            if (onNearbyClick) {
                onNearbyClick(ev);
            }
        },
        [onNearbyClick]
    );

    return (
        <SelectField
            async
            name="place"
            renderLabel={() => (
                <React.Fragment>
                    Area
                    <button
                        type="button"
                        className="field__label-btn ml-auto"
                        onClick={handleNerbyClick}
                    >
                        Nearby
                    </button>
                </React.Fragment>
            )}
            labelAlign="top"
            placeholder="Select area"
            maxMenuHeight={140}
            loadOptions={fetchPlaceOptions}
            getOptionLabel={getOptionLabel}
            getOptionValue={getOptionValue}
            isOptionSelected={isOptionSelected}
            formatOptionLabel={formatOptionLabel}
        />
    );
};

CompaniesSearchAreaSelectFieldInner.propsTypes = {
    onNearbyClick: PropTypes.func
};

export const CompaniesSearchAreaSelectField = memo(CompaniesSearchAreaSelectFieldInner);
