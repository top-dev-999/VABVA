import React, { memo, useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';
import _startCase from 'lodash/startCase';

import { SelectField } from '../../../ui/FormikForm';
import { FieldSelectedList, FieldSelectedListitem } from '../../../ui/FieldSelectedList';
import { SelectInputHighlighter } from '../../../ui/SelectInput';
import { getMapServices } from '../../../../services/api/maps';

const CompaniesSearchTagsSelectFieldInner = () => {
    const { setFieldValue, values } = useFormikContext();

    const fetchServiceOptions = useCallback(async (query = '') => {
        try {
            return getMapServices(query);
        } catch (e) {
            console.error(e);
            return [];
        }
    }, []);

    const handleChange = useCallback(
        (option) => {
            const prevValue = (values?.services || []).filter((item) => item !== option?.id);

            setFieldValue('services', [...prevValue, option?.id]);
        },
        [values, setFieldValue]
    );

    const handleUnselectTag = (id) => (ev) => {
        const newValue = (values?.services || []).filter((item) => item !== id);

        setFieldValue('services', newValue);
    };

    const getOptionLabel = useCallback((option) => option?.name, []);

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

    const shouldDisplaySelectedTags = values?.services && values?.services.length > 0;

    return (
        <React.Fragment>
            <SelectField
                async
                name="__tags-uncontrolled"
                label="Tags"
                labelAlign="top"
                placeholder="Select tags"
                maxMenuHeight={140}
                value=""
                loadOptions={fetchServiceOptions}
                getOptionLabel={getOptionLabel}
                getOptionValue={getOptionValue}
                isOptionSelected={isOptionSelected}
                formatOptionLabel={formatOptionLabel}
                onChange={handleChange}
            />

            {shouldDisplaySelectedTags && (
                <FieldSelectedList>
                    {values.services.map((service) => {
                        const name = _startCase(service);

                        return (
                            <FieldSelectedListitem
                                key={service}
                                onDelete={handleUnselectTag(service)}
                            >
                                {name}
                            </FieldSelectedListitem>
                        );
                    })}
                </FieldSelectedList>
            )}
        </React.Fragment>
    );
};

CompaniesSearchTagsSelectFieldInner.propsTypes = {
    onNearbyClick: PropTypes.func
};

export const CompaniesSearchTagsSelectField = memo(CompaniesSearchTagsSelectFieldInner);
