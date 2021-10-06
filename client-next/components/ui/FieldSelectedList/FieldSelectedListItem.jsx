import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { CrossSvg } from '../../../assets/svg';

const FieldSelectedListitem = (props) => {
    const { children, className, onDelete, ...other } = props;

    const handleDeleteClick = (ev) => {
        if (onDelete) {
            onDelete(ev);
        }
    };

    return (
        <div {...other} className={classNames('field-selected-list__item', className)}>
            <span className="field-selected-list__text">{children}</span>
            <button className="field-selected-list__btn" onClick={handleDeleteClick}>
                <CrossSvg className="field-selected-list__btn-icon" />
            </button>
        </div>
    );
};

FieldSelectedListitem.propTypes = {
    children: PropTypes.string,
    className: PropTypes.string,
    onDelete: PropTypes.func
};

export { FieldSelectedListitem };
