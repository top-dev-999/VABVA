import React, { useMemo } from 'react';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';

import { Modal } from '../Modal';
import { DraggableWrap } from '../DraggableWrap';
import { createCtx } from '../utils';

const WindowContext = createCtx();

export const useWindowContext = WindowContext.useContext;

export const Window = React.forwardRef(function Window(props, ref) {
    const {
        open,
        onClose,
        children,
        className,
        maxWidth,
        fullScreen,
        draggable = true,
        transitionProps,
        style,
        ...modalProps
    } = props;

    const customStyles = {
        ...(maxWidth && !fullScreen && { maxWidth })
    };

    const contextValue = useMemo(
        () => ({
            draggable
        }),
        [draggable]
    );

    return (
        <Modal open={open} onClose={onClose} {...modalProps}>
            <CSSTransition
                in={open}
                timeout={250}
                classNames="window"
                appear
                unmountOnExit
                {...transitionProps}
            >
                <DraggableWrap disabled={!draggable}>
                    <div
                        className={classNames('window', className, {
                            'window--fullscreen': fullScreen
                        })}
                        style={{ ...customStyles, ...style }}
                        ref={ref}
                    >
                        <WindowContext.Provider value={contextValue}>
                            {children}
                        </WindowContext.Provider>
                    </div>
                </DraggableWrap>
            </CSSTransition>
        </Modal>
    );
});
