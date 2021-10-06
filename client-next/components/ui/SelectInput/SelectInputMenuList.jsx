import { listen } from 'dom-helpers';
import React from 'react';

import { Scrollbar } from '../Scrollbar';

const SelectInputMenuList = (props) => {
    const { cx, innerProps, className, children, innerRef } = props;

    const { overflowY, ...styles } = props.getStyles('menuList', props);

    const { maxHeight, paddingBottom = 0, paddingTop = 0 } = styles;
    const autoHeightMax = maxHeight - paddingBottom - paddingTop;

    return (
        <div
            style={styles}
            className={cx(
                {
                    'menu-list': true
                },
                className
            )}
            {...innerProps}
        >
            <Scrollbar autoHeight autoHeightMax={autoHeightMax} ref={innerRef}>
                {children}
            </Scrollbar>
        </div>
    );
};

export { SelectInputMenuList };
