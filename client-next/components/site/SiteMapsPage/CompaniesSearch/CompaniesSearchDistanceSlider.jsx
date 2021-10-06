import React, { useCallback, memo, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useFormikContext } from 'formik';

import { Slider } from '../../../ui/Slider';
import { FieldControl } from '../../../ui';

const CompaniesSearchDistanceSliderInner = () => {
    const { setFieldValue, getFieldMeta } = useFormikContext();

    const handleChangeCommited = useCallback(
        (ev) => {
            setFieldValue('distance', ev.target.value);
        },
        [setFieldValue]
    );

    const renderThumbLabelText = useCallback((value) => `${value} mi`, []);
    const renderMarkText = useCallback((value) => String(value).padStart(2, '0'), []);

    const defaultValue = useMemo(() => getFieldMeta('distance').value, [getFieldMeta]);

    return (
        <FieldControl
            labelAlign="top"
            renderLabel={() => (
                <>
                    Distance (<span className="field__label-note">Miles</span>)
                </>
            )}
            component={Slider}
            defaultValue={defaultValue}
            min={1}
            max={50}
            openThumbLabel
            fullWidth
            disableMarks={false}
            renderThumbLabelText={renderThumbLabelText}
            renderMarkText={renderMarkText}
            onChangeCommited={handleChangeCommited}
        />
    );
};

export const CompaniesSearchDistanceSlider = memo(CompaniesSearchDistanceSliderInner);
