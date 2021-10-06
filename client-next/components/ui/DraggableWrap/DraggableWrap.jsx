import React from 'react';
import Draggable from 'react-draggable';

export const DraggableWrap = (props) => {
    const { children, disabled, ...other } = props;

    if (disabled) {
        return children || null;
    }

    return (
        <Draggable handle=".react-draggable__handle" bounds="body" {...other}>
            {children}
        </Draggable>
    );
};
