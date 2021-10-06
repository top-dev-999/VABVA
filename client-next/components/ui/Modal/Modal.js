import React, { useState, useRef, useEffect, useCallback, useMemo, useLayoutEffect } from 'react';
import classNames from 'classnames';
import FocusLock from 'react-focus-lock';

import { Backdrop } from '../Backdrop';
import { Portal } from '../Portal';
import { setRef, useBodyOverflow, useEventCallback } from '../utils';
import { ModalManager } from './ModalManager';

const getHasTransition = (props) => {
    return props.children && props.children.props.hasOwnProperty('in');
};

const manager = new ModalManager();

export const Modal = React.forwardRef(function Modal(props, ref) {
    const {
        children,
        open,
        className,
        centered,
        backdrop = true,
        overflow,
        disableRestoreFocus = false,
        // TODO: Fix transitions issue when `disableFocusBounding=false`
        disableFocusBounding = true,
        disableBackdropClick = false,
        disableEscapeKeyDown = false,
        disableScrollLock = false,
        backdropTransitionProps,
        onEscapeKeyDown,
        onClose,
        onOpen,
        ...other
    } = props;

    const [exited, setExited] = useState(true);
    const [modalNode, setModalNode] = useState(null);
    const backdropRef = useRef(null);
    const triggerRef = useRef(null);
    const { isBodyOverflowing, setBodyOverflow } = useBodyOverflow();
    const hasTransition = getHasTransition(props);

    const isTopModal = useCallback(() => {
        if (modalNode) {
            return manager.isTopModal(modalNode);
        }

        return false;
    }, [modalNode]);

    // Handlers

    const handleOpen = useCallback(() => {
        if (onOpen) {
            onOpen();
        }
    }, [onOpen]);

    const handleClose = useCallback(() => {
        if (onClose) {
            onClose();
        }
    }, [onClose]);

    const handleEnter = useEventCallback(() => {
        setExited(false);

        if (props.children && props.children.props && props.children.props.onEnter) {
            props.children.props.onEnter();
        }
    });

    const handleExited = useEventCallback(() => {
        setExited(true);

        if (props.children && props.children.props && props.children.props.onExited) {
            props.children.props.onExited();
        }
    });

    const handleDocumentKeyDown = useCallback(
        (ev) => {
            ev.stopPropagation();

            if (!modalNode) {
                return;
            }

            const isValidTarget = modalNode.contains(ev.target);

            if (ev.key === 'Escape' && !disableEscapeKeyDown && isValidTarget && isTopModal()) {
                if (onEscapeKeyDown) {
                    onEscapeKeyDown(ev);
                } else {
                    handleClose();
                }
            }
        },
        [modalNode, disableEscapeKeyDown, handleClose, onEscapeKeyDown, isTopModal]
    );

    const handleClick = useCallback(
        (ev) => {
            if (
                !backdrop &&
                !disableBackdropClick &&
                modalNode &&
                modalNode.isEqualNode(ev.target)
            ) {
                handleClose();
            }
        },
        [backdrop, modalNode, disableBackdropClick, handleClose]
    );

    const handleBackdropClick = useCallback(
        (ev) => {
            ev.preventDefault();
            ev.stopPropagation();

            if (
                !disableBackdropClick &&
                backdropRef.current &&
                backdropRef.current.isEqualNode(ev.target)
            ) {
                handleClose();
            }
        },
        [handleClose, disableBackdropClick]
    );

    const handlePortalRendered = useCallback(() => {
        handleOpen();
    }, [handleOpen]);

    // Effects

    useEffect(() => {
        if (open && modalNode) {
            setRef(ref, modalNode);

            return () => {
                setRef(ref, null);
            };
        }

        return undefined;
    }, [open, modalNode, ref]);

    useEffect(() => {
        if (disableRestoreFocus) {
            return undefined;
        }

        if (open) {
            // Initialize an active element to restore focus after close
            triggerRef.current = document.activeElement;
        }

        return undefined;
    }, [open, disableRestoreFocus]);

    useEffect(() => {
        if (modalNode) {
            manager.add(modalNode);

            return () => {
                manager.remove(modalNode);

                // Restore focus
                if (triggerRef.current) {
                    triggerRef.current?.focus();
                }
            };
        }

        return undefined;
    }, [modalNode]);

    // Toggle the body scrollbar visibility
    useEffect(() => {
        if (!disableScrollLock && open && modalNode && isBodyOverflowing()) {
            setBodyOverflow(false);
        }
    }, [modalNode, open, disableScrollLock, isBodyOverflowing, setBodyOverflow]);

    useEffect(() => {
        if (!disableScrollLock && modalNode && !isBodyOverflowing()) {
            return () => {
                if (manager.length === 0) {
                    setBodyOverflow(true);
                }
            };
        }

        return undefined;
    }, [open, modalNode, disableScrollLock, isBodyOverflowing, setBodyOverflow]);

    useEffect(() => {
        document.addEventListener('keydown', handleDocumentKeyDown);

        return () => {
            document.removeEventListener('keydown', handleDocumentKeyDown);
        };
    }, [handleDocumentKeyDown]);

    // Render

    const childProps = useMemo(() => {
        if (hasTransition) {
            return {
                onEnter: handleEnter,
                onExited: handleExited
            };
        }

        return {};
    }, [hasTransition, handleEnter, handleExited]);

    if (!open && (!hasTransition || exited)) {
        return null;
    }

    const childrenContent = React.isValidElement(children)
        ? React.cloneElement(children, childProps)
        : null;

    const backdropContent = backdrop ? (
        <Backdrop
            open={open}
            transition={hasTransition}
            className="modal__backdrop"
            transitionProps={backdropTransitionProps}
            ref={backdropRef}
            onClick={handleBackdropClick}
        />
    ) : null;

    return (
        <Portal onRendered={handlePortalRendered}>
            <div
                role="presentation"
                className={classNames('modal', className, {
                    'modal--hidden': !open && exited,
                    'modal--centered': centered,
                    'modal--overflow': overflow
                })}
                onClick={handleClick}
                tabIndex={-1}
                ref={setModalNode}
                {...other}
            >
                {!disableFocusBounding ? (
                    <FocusLock autoFocus returnFocus={false} className="modal__focus-trap">
                        {backdropContent}
                        {childrenContent}
                    </FocusLock>
                ) : (
                    <>
                        {backdropContent}
                        {childrenContent}
                    </>
                )}
            </div>
        </Portal>
    );
});
