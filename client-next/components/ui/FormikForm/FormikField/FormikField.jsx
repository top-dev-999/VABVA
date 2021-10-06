import React, { memo } from 'react';
import { useField } from 'formik';

import { FieldControl } from '../../FieldControl';

const FormikFieldInner = React.forwardRef(function FormikField(props, ref) {
    const { component: Component, inputComponent: InputComponent, ...other } = props;

    const [field, meta] = useField({ ...other });
    const { error, touched } = meta;

    const fieldProps = {
        ...field,
        ...other,
        error,
        touched
    };

    return (
        <FieldControl
            {...fieldProps}
            ref={ref}
            component={Component}
            inputComponent={InputComponent}
        />
    );
});

export const FormikField = memo(FormikFieldInner);
