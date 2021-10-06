import React from 'react';

import BootstrapPopover from 'react-bootstrap/Popover';
import BootstrapPopoverContent from 'react-bootstrap/PopoverContent';

export const Popover = React.forwardRef(function Popover(props, forwardedRef) {
    const { children, ...other } = props;

    return (
        <BootstrapPopover {...other} ref={forwardedRef}>
            <BootstrapPopoverContent>{children}</BootstrapPopoverContent>
        </BootstrapPopover>
    );
});
