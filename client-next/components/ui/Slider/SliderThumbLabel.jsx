import React from 'react';
import classNames from 'classnames';

const defaultRenderValue = (value) => value;

export const SliderThumbLabel = (props) => {
    const { children, value, open, disabled, renderValue = defaultRenderValue } = props;

    if (disabled) {
        return children;
    }

    return React.cloneElement(
        children,
        {
            className: classNames(children.props.className, {
                'slider__thumb--open-label': open
            })
        },
        <div className="slider__thumb-label">
            <div className="slider__thumb-label-text">{renderValue(value)}</div>
        </div>
    );
};
