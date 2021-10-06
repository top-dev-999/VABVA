import React from 'react';
import classNames from 'classnames';

export const BoxLabel = React.forwardRef(function BoxLabel(props, forwardedRef) {
    const { children, className, label, labelAlign, disabled, condensed, ...other } = props;

    const childElement = React.isValidElement(children)
        ? React.cloneElement(children, {
              disabled
          })
        : null;

    return (
        <label
            className={classNames('box-label', className, {
                [`box-label--align-${labelAlign}`]: labelAlign,
                'box-label--disabled': disabled,
                'box-label--condensed': condensed
            })}
            ref={forwardedRef}
            {...other}
        >
            <div className="box-label__content">{childElement}</div>
            {label && <div className="box-label__text">{label}</div>}
        </label>
    );
});
