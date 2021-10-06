import React from 'react';
import classNames from 'classnames';

import { Scrollbar } from '../Scrollbar';

export const List = React.forwardRef(function List(props, ref) {
    const {
        children,
        className,
        maxHeight,
        autoHeight = true,
        defaultExpanded = false,
        scrollbarProps,
        scrollbarRef,
        ...other
    } = props;

    const scrollable = !autoHeight || maxHeight;
    const enhancedScrollbarProps = {
        ...(maxHeight && { autoHeight: true, autoHeightMax: maxHeight }),
        ...scrollbarProps
    };

    const items = React.Children.toArray(children);

    return (
        <div role="list" className={classNames('list', className)} ref={ref} {...other}>
            {scrollable ? (
                <Scrollbar {...enhancedScrollbarProps} ref={scrollbarRef}>
                    {children}
                </Scrollbar>
            ) : (
                items
            )}
        </div>
    );
});
