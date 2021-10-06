import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CircularProgress, IconButton, Mask, MaskProgress } from '../../ui';
import { ArrowLeft18Svg } from '../../../assets/svg';

const MapsPagePanel = (props) => {
    const { children, title = '', className, loading = false, onClose, ...other } = props;

    const handleClose = useCallback(
        (ev) => {
            if (onClose) {
                onClose(ev);
            }
        },
        [onClose]
    );

    const shouldDisplayHeader = title || onClose;

    return (
        <section className={classNames('maps-page__panel', className)} {...other}>
            <Mask open={loading}>
                <MaskProgress>
                    <CircularProgress size="large" />
                </MaskProgress>
            </Mask>

            {shouldDisplayHeader && (
                <header className="maps-page__panel-header">
                    {onClose && (
                        <IconButton className="maps-page__panel-back" onClick={handleClose}>
                            <ArrowLeft18Svg />
                        </IconButton>
                    )}
                    {title && <h6 className="maps-page__panel-title">{title}</h6>}
                </header>
            )}
            <div className="maps-page__panel-body">{children}</div>
        </section>
    );
};

MapsPagePanel.propTypes = {
    children: PropTypes.node,
    title: PropTypes.string,
    className: PropTypes.string,
    loading: PropTypes.bool,
    onClose: PropTypes.func
};

export { MapsPagePanel };
