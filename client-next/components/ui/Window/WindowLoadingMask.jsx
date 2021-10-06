import React from 'react';

import { Mask, MaskProgress } from '../Mask';
import { CircularProgress } from '../CircularProgress';

export const WindowLoadingMask = (props) => {
    const {
        open,
        primary = true,
        secondary,
        position = 'center',
        title,
        progressProps,
        ...other
    } = props;

    const progressComponent = <CircularProgress />;

    const currentProgressComponent = React.cloneElement(progressComponent, {
        size: 'large',
        ...progressProps
    });

    return (
        <Mask open={open} {...other}>
            <MaskProgress position={position} primary={primary} secondary={secondary} title={title}>
                {currentProgressComponent}
            </MaskProgress>
        </Mask>
    );
};
