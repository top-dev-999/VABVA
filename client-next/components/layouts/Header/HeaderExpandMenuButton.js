import React, { memo, useState, useCallback } from 'react';

import { IconButton } from '../../ui';
import { Menu16Svg } from '../../../assets/svg';
import { MobileMainMenu } from '../MobileMainMenu/MobileMainMenu';

const HeaderExpandMenuButtonInner = (props) => {
    const [openMenu, setOpenMenu] = useState(false);

    const handleButtonClick = useCallback(() => {
        setOpenMenu((prevState) => !prevState);
    }, []);

    const handleClose = useCallback(() => {
        setOpenMenu(false);
    }, []);

    return (
        <React.Fragment>
            <IconButton {...props} onClick={handleButtonClick}>
                <Menu16Svg />
            </IconButton>
            <MobileMainMenu open={openMenu} onClose={handleClose} />
        </React.Fragment>
    );
};

export const HeaderExpandMenuButton = memo(HeaderExpandMenuButtonInner);
