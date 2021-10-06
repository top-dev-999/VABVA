import React from 'react';

import { IconButton } from '../IconButton';

export const InputIconButton = React.forwardRef(function InputIconButton(props, ref) {
    const { tabIndex = -1, ...other } = props;

    return (
        <IconButton
            className="input__btn-icon"
            size="small"
            plain
            tabIndex={tabIndex}
            {...other}
            ref={ref}
        />
    );
});
