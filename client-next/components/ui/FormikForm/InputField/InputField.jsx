import React from 'react';

import { Input } from '../../Input';
import { FormikField } from '../FormikField';

export const InputField = React.forwardRef(function InputField(props, forwardedRef) {
    return <FormikField {...props} inputComponent={Input} ref={forwardedRef} />;
});
