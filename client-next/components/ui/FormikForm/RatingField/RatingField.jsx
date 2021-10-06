import React from 'react';

import { Rating } from '../../Rating';
import { FormikField } from '../FormikField';

export const RatingField = React.forwardRef(function RatingField(props, ref) {
    return <FormikField {...props} ref={ref} component={Rating} />;
});
