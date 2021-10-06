import React from 'react';
import { useField, useFormikContext } from 'formik';

import { useEventCallback } from '../../utils';
import { FieldControl } from '../../FieldControl';
import { SelectInput } from '../../SelectInput';

export const SelectField = React.forwardRef(function SelectField(props, forwardedRef) {
    const {
        component: Component,
        inputComponent: InputComponent,
        inputName,
        onChange,
        onInputChange,
        ...other
    } = props;

    const { setFieldValue, getFieldMeta } = useFormikContext();
    const [field, meta, helpers] = useField({ ...other });
    const { error, touched } = meta;

    let inputValue;

    if (inputName) {
        const inputFieldMeta = getFieldMeta(inputName);

        inputValue = inputFieldMeta.value;
    }

    const handleChange = useEventCallback((option) => {
        helpers.setValue(option);

        if (onChange) {
            onChange(option);
        }
    });

    const handleInputChange = useEventCallback((value, context) => {
        if (inputName && context.action === 'input-change') {
            setFieldValue(inputName, value);
        }

        if (onInputChange) {
            onInputChange(value);
        }
    });

    const fieldProps = {
        ...field,
        ...other,
        inputValue,
        errorVariant: 'text',
        error,
        touched,
        onInputChange: handleInputChange,
        onChange: handleChange
    };

    return <FieldControl {...fieldProps} ref={forwardedRef} inputComponent={SelectInput} />;
});
